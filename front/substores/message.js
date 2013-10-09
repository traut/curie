var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');
    solrUtils = require('../solrUtils');
    converter = require('../converter');

var log = utils.getLogger("store.message");

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
            log.info("Patching message with params", options);
            var changed = options.item;
            changed.id = options.messageId;

            var mid = options.messageId;

            solrUtils.getMessage(handshake.session.user.hash, mid, function(err, doc) {
                if (err) {
                    callback(err, null);
                    return;
                }
                for(var key in options.changed) {
                    doc[key] = options.changed[key];
                }
                doc["_version_"] = 1; // document must exist
                solrUtils.indexMessage(doc, function(err, doc) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    callback(null, converter.solrToEmailPreview(doc));
                });
            });
        },
    }
}


module.exports = {
    MessageStore : MessageStore
}
