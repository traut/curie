var http = require('http'),
    socketio = require('socket.io'),
    fs = require('fs'),
    util = require('util'),
    crypto = require('crypto');

var store = require("./store.js");
var feed = require("./feed.js");

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/html/index.html'));
}).listen(8080, function() {
    util.log('Listening at: http://localhost:8080');
});

var io = socketio.listen(server);


var expectedPassword = "expected-password";

io.configure(function (){
    io.set('authorization', function (handshakeData, callback) {
        util.log(handshakeData);

        var email = handshakeData.query.email;
        var pass = handshakeData.query.password;

        var shasum = crypto.createHash('sha512');
        var channel = shasum.update(email).digest('hex');

        if (pass != expectedPassword) {
            callback(null, false);
            return;
        }

        handshakeData["user"] = {
            email : email
        };

        util.log("User " + email + " authorized. Creating special channel '" + channel + "'");

        io.of("/stream/" + channel).on('connection', function (socket) {
            util.log(email + " connected");

            socket.on('create', function (data) {
                store.create(socket, data.cast);       
            });      
            socket.on('read', function (data) {
                console.info(data);
                store.read(socket, data.cast);
            });  
            socket.on('update', function (data) {
                util.log("update " + data);
                store.update(socket, data.cast);       
            }); 
            socket.on('delete', function (data) {
                util.log("delete " + data);
                store.destroy(socket, data.cast);       
            });

            feed.subscribe("someRedisFeed", "new-received", socket);

        });

        callback(null, true);
    });
});


