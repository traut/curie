var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils'),
    solrUtils = require('../solrUtils'),
    converter = require('../converter'),
    messagesStore = require('../substores/message.js');

var log = utils.getLogger("store.thread");


ThreadStore = function() {
    return {
        getThread : function(handshake, options, callback) {
            var tid = options.threadId;
            var account = handshake.session.user.hash;

            log.info("Getting thread", tid);

            queryForThreadMessages(tid, account, function(err, messages) {
                if (err) {
                    callback(err, []);
                    return;
                }
                messagesStore.getFullMessages(account, messages, function(err, fullMessages) {
                    var thread = {
                        thread : tid,
                        messages : fullMessages,
                    }
                    callback(null, thread);
                    log.info("Thread " + tid + " with " + fullMessages.length + " messages has been sent");
                });
            });
        }
    }
}

function queryForThreadMessages(threadId, account, callback) {
    var query = "+threads:" + threadId + solrUtils.accessControl(account);
    solrUtils.query(query, {
        rows : settings.INFINITY,
        fields : 'id,labels,unread',
        sort : 'received asc'
    }, function(err, response) {
        if (err) {
            callback(err, null);
            return;
        }
        log.info("query=" + query + ", results.length=" + response.response.docs.length);
        callback(null, response.response.docs);
    });
}

module.exports = {
    ThreadStore : ThreadStore
}
