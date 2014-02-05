var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils'),
    solrUtils = require('../solrUtils'),
    converter = require('../converter');

var log = utils.getLogger("store.message");

var getFullMessages = function(account, solrMessages, callback) {
    log.info("Getting " + solrMessages.length + " messages from filesystem");

    var solrMessagesById = {};
    solrMessages.forEach(function(m) {
        solrMessagesById[m.id] = m;
        return m.id;
    });

    var paths = solrMessages.map(function(message) {
        if (message.labels && message.labels.indexOf("draft") > -1) {
            return utils.draftPath(account, message.id);
        } else {
            return utils.messageParsedPath(message.id);
        }
    });

    function readAsync(file, callback) {
        fs.readFile(file, 'utf8', callback);
    }

    async.map(paths, readAsync, function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        var fullMessages = results.map(function(parsedContent) {
            var parsed = JSON.parse(parsedContent);
            return converter.parsedAndSolrToEmail(
                parsed,
                solrMessagesById[parsed.id]
            );
        });
        callback(null, fullMessages);
    });
}

MessageStore = function() {
    return {
        getMessage : function(handshake, options, callback) {
            var mid = options.messageId;

            log.info("Reading message", mid);

            var path = utils.messageParsedPath(mid);

            async.parallel({
                fs : function(callback) {
                    utils.readFromFile(path, callback);
                },
                solr : function(callback) {
                    solrUtils.getMessage(handshake.session.user.hash, mid, callback);
                }
            }, function(err, results) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var email = converter.parsedAndSolrToEmail(results.fs, results.solr);
                //email.body = results.fs.body;
                callback(null, email);
                log.info("Message " + mid + " was send");
            });
        },
        patchMessage : function(handshake, options, callback) {
            log.info("Patching message with params", {params : options});
            var changed = options.item;
            var mid = options.messageId;

            solrUtils.getMessage(handshake.session.user.hash, mid, function(err, doc) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var patch = {};
                if ("unread" in changed) {
                    patch["unread"] = {set : changed.unread};
                }
                if ("labels" in changed) {
                    patch["labels"] = {set : changed.labels};
                }
                solrUtils.updateMessage(doc.id, patch, function(err) {
                    log.info("patching for " + doc.id  + " is done");
                    callback(err);
                });
//                for(var key in options.changed) {
//                    doc[key] = options.changed[key];
//                }
//                solrUtils.indexMessage(doc, function(err, doc) {
//                    if (err) {
//                        callback(err, null);
//                        return;
//                    }
//                });
            });
        },
        deleteMessageForever : function(handshake, options, callback) {
            var message = options.item;
            var userHash = handshake.session.user.hash;

            async.waterfall([
                function(_callback) {
                    log.info("Deleting " + message.id + ". Getting message");
                    solrUtils.getMessage(userHash, message.id, _callback);
                },
                function(message, _callback) {
                    log.info("Deleting " + message.id + ". Deleting from index");
                    solrUtils.deleteMessage(message.id, _callback);
                },
                function(_callback) {
                    log.info("Deleting " + message.id + ". Deleting from FS");
                    utils.deleteFile(utils.messageParsedPath(message.id), _callback);
                }
            ], function(err) {
                callback(err, null);
            });

        },
    }
}


module.exports = {
    getFullMessages : getFullMessages,
    MessageStore : MessageStore
}
