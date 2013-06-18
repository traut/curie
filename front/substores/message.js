var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');

var log = utils.getLogger("store.message");

MessageStore = function() {
    return {
        getMessage : function(handshake, options, callback) {
            var mid = options.messageId;
            var toEmail = handshake.session.user.email;

            log.info("Reading message", mid);

            var path = utils.messageParsedPath(mid);

            async.parallel({
                fs : function(callback) {
                    readMessageFromFile(path, callback);
                },
                solr : function(callback) {
                    queryForMessage(mid, callback);
                }
            }, function(err, results) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var email = utils.emailFromDoc(results.solr);
                email.body = results.fs.body;
                callback(null, email);
                log.info("Message " + mid + " was send");
            });
        },
        patchMessage : function(handshake, options, callback) {
            log.info("Patching message with params", options);
            var changed = options.item;
            changed.id = options.messageId;

            var mid = options.messageId;

            queryForMessage(mid, function(err, doc) {
                if (err) {
                    callback(err, null);
                    return;
                }
                for(var key in options.changed) {
                    doc[key] = options.changed[key];
                }
                doc["_version_"] = 1; // document must exist
                utils.solr.add(doc, function(err) {
                    if (err) {
                        log.error("Can't add a doc", {doc : doc, err: err});
                        callback(err, null);
                        return;
                    }
                    utils.solr.commit(function(err) {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        log.info("Update successful mid=" + mid);
                        callback(null, null);
                    });
                });
            });
        },
    }
}

function queryForMessage(messageId, callback) {
    //FIXME: no access control. replace /get with /select 
    utils.solr.get("get?id=" + messageId, function(err, response) {
        if (err) {
            callback(err, null);
            return;
        }
        var responseObj = JSON.parse(response);
        callback(null, responseObj.doc);
    });
}

function readMessageFromFile(path, callback) {
    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
              log.error("Can't read a file " + path, err);
              callback(err, null);
              return;
            }
            var json = JSON.parse(data);
            callback(null, utils.emailFromDoc(json));
        });
    } else {
        log.error("Requested path doesn't exists path=" + path);
        callback("Path " + path + " doesn't exists!", null);
    }
}

module.exports = {
    MessageStore : MessageStore
}
