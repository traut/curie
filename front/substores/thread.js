var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');
    converter = require('../converter');

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

                var messagesMap = {};
                var mids = messages.map(function(m) {
                    messagesMap[m.id] = m;
                    return m.id;
                });

                log.info("Getting " + mids.length + " messages from filesystem");

                var paths = mids.map(utils.messageParsedPath);

                function readAsync(file, callback) {
                    fs.readFile(file, 'utf8', callback);
                }

                async.map(paths, readAsync, function(err, results) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    var thread = {
                        thread : tid,
                        messages : results.map(function(parsedContent) {
                            var parsed = JSON.parse(parsedContent);
                            return converter.parsedAndSolrToEmail(
                                parsed,
                                messagesMap[parsed.id]
                            );
                        })
                    }
                    callback(null, thread);
                    log.info("Thread " + tid + " with " + mids.length + " messages has been sent");
                });

            });
        }
    }
}

function queryForThreadMessages(threadId, account, callback) {
    var query = "+threads:" + threadId + utils.accessControl(account);
    utils.solr.query(query, {
        rows : settings.INFINITY,
        fields : 'id,labels,unread',
        sort : 'received asc'
    }, function(err, response) {
        if (err) {
            callback(err, null);
            return;
        }
        var responseObj = JSON.parse(response);
        log.info("query=" + query + ", results.length=" + responseObj.response.docs.length);
        callback(null, responseObj.response.docs);
    });
}

module.exports = {
    ThreadStore : ThreadStore
}
