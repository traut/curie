var http = require('http'),
    socketio = require('socket.io'),
    fs = require('fs'),
    crypto = require('crypto'),
    redis = require('redis'),
    winston = require('winston');

var store = require("./store.js");
var feed = require("./feed.js");

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/html/index.html'));
}).listen(8080, function() {
    winston.info('Listening at: http://localhost:8080');
});

var io = socketio.listen(server);

var newMessagesSocketName = "new-messages";
var expectedPassword = "expected-password";


io.configure(function (){
    io.set('authorization', function (handshakeData, callback) {

        var email = handshakeData.query.email;
        var pass = handshakeData.query.password;

        var shasum = crypto.createHash('sha512');
        var channel = shasum.update(email).digest('hex');

        if (pass != expectedPassword) {
            callback(null, false);
            return;
        }

        handshakeData.user = {
            email : email,
        };

        var channelKey = "channel-" + channel;
        var channelNamespace = "/stream/" + channel;

        winston.info("User " + email + " authorized");

        if (!io.namespaces[channelNamespace]) {
            winston.info("Creating channel '" + channel + "'");

            io.of("/stream/" + channel).on('connection', function(socket) {
                winston.info("Connection created " + socket.id);

                socket.redis = redis.createClient();
                socket.redis.incr(channelKey);

                socket.on('create', function(data) {
                    winston.info("create", data);
                    store.create(socket, data.cast);       
                });
                socket.on('read', function(data) {
                    winston.info("read", data);
                    store.read(socket, data.cast);
                });  
                socket.on('update', function(data) {
                    winston.info("update", data);
                    store.update(socket, data.cast);       
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

                feed.subscribe(channel, newMessagesSocketName, socket);
            });
        }
        callback(null, true);
    });
});

