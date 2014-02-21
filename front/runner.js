var http = require('http'),
    socketio = require('socket.io'),
    fs = require('fs'),
    crypto = require('crypto'),
    cookie = require('cookie'),
    express = require('express'),
    RedisStore = require('connect-redis')(express),
    parseSignedCookie = require('express/node_modules/connect').utils.parseSignedCookie,

    settings = require('./settings'),
    users = require("./users.js"),
    utils = require('./utils'),
    solrUtils = require('./solrUtils'),
    store = require("./store.js"),
    feed = require("./feed.js"),

    attachmentStore = require("./substores/attachment.js");

var log = utils.getLogger("runner");


var sessionStore = new RedisStore({
    host : '127.0.0.1',
    port : 6379,
    db : 'curie.session'
});

var app = express();

app.configure(function () {
    app.use(express.cookieParser(settings.SECRET));
    app.use(express.session({
        secret : settings.SECRET,
        key : settings.COOKIE_NAME_SESSION,
        store : sessionStore,
        cookie : {
            maxAge: settings.COOKIE_EXIPE_IN,
            httpOnly : true,
        }
    }));
    app.use(express.bodyParser());
    //app.use(express.logger());
});

app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/html/index.html'));
});

app.post('/auth', function (req, res) {
    if (!req.body) {
        res.send({status : 'error', message : "No login/password"});
        return;
    }
    var login = req.body.login;
    var password = req.body.password;

    log.info("Signing in user=" + login);

    users.signIn(login, password, function(err, account) {
        if (account) {
            //FIXME: randomize channel hash
            var channel = crypto.createHash('sha512').update(account.hash).digest('hex');
            res.cookie("curie.channel", channel, {httpOnly: false});
            users.getAccountDetails(account.hash, function(err, details) {
                if (err) {
                    log.error(err);
                    res.send({status : 'error', message : "Account details are incomplete"});
                    return;
                }

                req.session.user = {
                    hash : account.hash,
                    channel : channel,
                    mailboxes : details
                };
                req.session.save();

                res.send({status : 'ok'});
            });
        } else {
            res.send({status : 'error', message : "No account found"});
        }
    });
});

app.get('/attachment/:message/:attachment', function (req, res) {
    if (!req.session.user || 1 == 2) {
        res.redirect('/'); // Unauthorized
        return;
    }

    attachmentStore.getAttachment(req.session.user.hash, req.params.message, req.params.attachment, function(errCode, response) {
        if (errCode) {
            res.send(errCore);
            return;
        }
        res.set(response.headers);
        res.sendfile(response.path);
    });
});


app.get('/logout', function (req, res) {
    log.info("Calling logout for " + req.sessionID);
    req.session.destroy();
    res.redirect('/');
});
 
var server = http.createServer(app);
var io = socketio.listen(server);
io.set('log level', 1); // info

io.configure(function (){
    io.set('authorization', function (handshakeData, callback) {

        log.info("Authorization request", handshakeData, {});

        handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || "");

        var sessionID = handshakeData.cookies[settings.COOKIE_NAME_SESSION];
        if (!sessionID) {
            callback("No session configured", false);
            return
        }
        var sessionIDRaw = parseSignedCookie(sessionID, settings.SECRET);

        handshakeData.sessionID = sessionIDRaw;
        log.info("Auth request with session=" + sessionIDRaw);

        sessionStore.get(sessionIDRaw, function(err, session) {

            if (err || !session) {
                log.warn("No session found for sessionIDRaw=" + sessionIDRaw);
                callback(null, false);
                return;
            }

            if (!session.user) {
                log.warn("No user for sessionIDRaw=" + sessionIDRaw);
                sessionStore.destroy(sessionIDRaw);
                callback(null, false);
                return;
            }

            log.info("User " + session.user.hash + " authorized");

            var channel = session.user.channel;
            var channelKey = "channel-" + channel;
            var channelNamespace = "/stream/" + channel;

            if (!io.namespaces[channelNamespace]) {
                log.info("Creating channel=" + channel + "");

                io.of("/stream/" + channel).on('connection', function(socket) {
                    log.info("Connection created socket.id=" + socket.id + ", sessionID=" + sessionIDRaw);

                    bindSocketCalls(socket);

                    //var newMessagesSocketName = "new-messages";
                    //feed.subscribe(channel, newMessagesSocketName, socket);
                });
            }
            callback(null, true);

        });
        

    });
});


function withSession(sessionId, callback) {
    sessionStore.get(sessionId, function(err, session) {
        if (err || !session) {
            log.error("Can't get session " + sessionId);
            callback(err, null);
            return;
        }
        callback(null, session);
    });
}

function bindSocketCalls(socket) {
    var sessionId = socket.handshake.sessionID;

    var runInSession = function(callback) {
        withSession(sessionId, function(err, session) {
            if (err || !session) {
                socket.emit("no-session");
                return;
            }
            if (!socket.handshake) {
                socket.emit("no-session");
                return;
            }
            socket.handshake.session = session;
            callback();
        });
    }

    socket.on('create', function(data) {
        runInSession(function() {
            log.log("debug", "create %j", data, {});
            store.create(socket, data.cast, data.item);
        });
    });
    socket.on('read', function(data) {
        runInSession(function() {
            log.log("debug", "read %j", data, {});
            store.read(socket, data.cast, data.ctx);
        });
    });  
    socket.on('update', function(data) {
        runInSession(function() {
            log.log("debug", "update %j", data, {});
            store.update(socket, data.cast, data.item);
        });
    }); 
    socket.on('patch', function(data) {
        runInSession(function() {
            log.log("debug", "patch %j", data, {});
            store.patch(socket, data.cast, data.changed);
        });
    }); 
    socket.on('delete', function(data) {
        runInSession(function() {
            log.log("debug", "delete %j", data, {});
            store.destroy(socket, data.cast, data.item);
        });
    });
    socket.on("disconnect", function() {
        log.info("Disconnect received for session=" + sessionId);
        //sessionStore.destroy(sessionId);
    });
}

server.listen(8080, function() {
    log.info('Listening at: http://localhost:8080');
});

