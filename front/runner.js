var http = require('http'),
    socketio = require('socket.io'),
    fs = require('fs'),
    crypto = require('crypto'),
    redis = require('redis'),
    winston = require('winston'),
    cookie = require('cookie');

var store = require("./store.js");
var feed = require("./feed.js");

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/html/index.html'));
}).listen(8080, function() {
    winston.info('Listening at: http://localhost:8080');
});

var io = socketio.listen(server);
io.set('log level', 1); // info

var newMessagesSocketName = "new-messages";

var expectedEmails = [
    "some@curie.heyheylabs.com",
    "t@curie.heyheylabs.com"
];

var expectedPassword = "p";

var sessions = {};


io.configure(function (){
    io.set('authorization', function (handshakeData, callback) {

        var cookies = cookie.parse(handshakeData.headers.cookie || "");
        if (cookies['curie.stream'] && cookies['curie.session']) {
            if (sessions[cookies['curie.session']]) {
                var sessionId = cookies['curie.session'];
                winston.info("Session " + sessionId + " authorized");

                handshakeData.session = sessions[sessionId];
                callback(null, true);
                return;
            }
        }

        var email = handshakeData.query.email;
        var pass = handshakeData.query.password;

        console.info(email + " " + pass);

        if (expectedEmails.indexOf(email) == -1 && pass != expectedPassword) {
            callback(null, false);
            return;
        }

        var sessionId = "session" + (Math.random() * 10000);
        sessions[sessionId] = handshakeData.session = {
            email : email,
            id : sessionId
        };

        var channel = crypto.createHash('sha512').update(email).digest('hex');
        var channelKey = "channel-" + channel;
        var channelNamespace = "/stream/" + channel;

        winston.info("User " + email + " authorized");

        if (!io.namespaces[channelNamespace]) {
            winston.info("Creating channel '" + channel + "'");

            io.of("/stream/" + channel).on('connection', function(socket) {
                winston.info("Connection created " + socket.id);

                socket.emit("session-id", socket.handshake.session.id);

                socket.redis = redis.createClient();
                socket.redis.incr(channelKey);

                socket.on('create', function(data) {
                    winston.info("create", data);
                    store.create(socket, data.cast, data.item);
                });
                socket.on('read', function(data) {
                    winston.info("read", data);
                    store.read(socket, data.cast, data.ctx);
                });  
                socket.on('update', function(data) {
                    winston.info("update", data);
                    store.update(socket, data.cast, data.item);
                }); 
                socket.on('patch', function(data) {
                    store.patch(socket, data.cast, data.changed);
                }); 
                socket.on('delete', function(data) {
                    winston.info("delete", data);
                    store.destroy(socket, data.cast);       
                });
                socket.on("disconnect", function() {
                    winston.info("Disconnect received for " + channel);
                    socket.redis.decr(channelKey, function(err, left) {
                        winston.info(left + " listeners on " + channel);
                        if (left == 0) {
                            socket.redis.del(channelKey);
                            delete io.namespaces[channelNamespace];
                            winston.info("Channel destroyed");
                        } 
                    });
                });

                //feed.subscribe(channel, newMessagesSocketName, socket);
            });
        }
        callback(null, true);
    });
});

