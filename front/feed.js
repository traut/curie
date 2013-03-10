var redis = require('redis');

module.exports = {
    subscribe : function(feedName, socketEventName, socket) {
        var client = redis.createClient();
        client.on('error', function (err) {
            console.info('Error ' + err);
        });
        client.on('message', function (channel, message) {
            console.info("channel: " + channel + "; message: " + messages);
            socket.emit(socketEventName, { pack: 'inbox', message: message });
        });
        client.on('disconnect', function() {
            console.info('Disconnected from Redis feed ' + feedName);
        });
        client.subscribe(feedName);
        console.info("Subscribed to " + feedName);
    }
}

