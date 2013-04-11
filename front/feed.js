var redis = require('redis'),
    winston = require('winston');

module.exports = {
    subscribe : function(feedName, socketEventName, socket) {
        if (!socket.feed) {
            socket.feed = redis.createClient();
            socket.feed.on('subscribe', function(feed, count) {
                winston.info("Socket " + socket.id + " subscribed to " + feed);
            });

            socket.feed.on('message', function (channel, noticeStr) {
                var notice = JSON.parse(noticeStr);
                socket.emit(socketEventName, { message: notice.message });
            });

            socket.feed.subscribe(feedName);

            socket.on("disconnect", function() {
                socket.feed.unsubscribe(feedName);
                socket.feed.quit();
            });
        }
    }
}

