var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');
    solrUtils = require('../solrUtils');
    converter = require('../converter');

var log = utils.getLogger("store.draft");


var LABELS = {
    draft : "draft",
    inbox : "inbox",
    sent : "sent",
}

DraftStore = function() {
    return {
        getDraft : function(handshake, options, callback) {
            var draftId = options.draftId;
            var userHash = handshake.session.user.hash;

            if (!draftId) {
                callback("No draftId specified", null);
                return;
            }

            async.parallel({
                fs : function(callback) {
                    var path = utils.draftPath(userHash, draftId);
                    utils.readFromFile(path, callback);
                },
                solr : function(callback) {
                    solrUtils.getMessage(userHash, draftId, callback);
                }
            }, function(err, results) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var email = converter.parsedAndSolrToEmail(results.fs, results.solr);
                email.draft = true;

                callback(null, email);
                log.info("Draft " + draftId + " was send");
            });
        },
        deleteDraft : function(handshake, options, callback) {
            var draft = options.item;
            var userHash = handshake.session.user.hash;

            log.info("Deleting " + draft.id + ". Getting message");
            solrUtils.getMessage(userHash, draft.id, function(err, message) {
                if (err) {
                    callback(err, null);
                    return;
                }

                log.info("Deleting " + draft.id + ". Deleting from index");
                solrUtils.deleteMessage(draft.id, function(err, message) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    log.info("Deleting " + draft.id + ". Deleting from FS");
                    utils.deleteFile(utils.draftPath(userHash, draft.id), function(err) {
                        if (err) {
                            callback(err, null);
                            return;
                        }

                        callback();
                    });

                });

            });

        },
        updateDraft : function(handshake, options, callback) {
            var draft = options.item;
            var userHash = handshake.session.user.hash;

            draft.id = draft.id || utils.uniqueId();
            draft.account = userHash;
            draft.from = [{ email : "t@curie.heyheylabs.com", name : "Some Guy" }];
            draft.__references = (draft.in_reply_to == null || draft.in_reply_to == '') ? [] : [draft.in_reply_to];
            draft.in_reply_to = '';
            draft.received = new Date();

            draft.__message_id = (draft.sent) ? utils.createMessageId(draft.id) : ('dummy' + draft.id);

            var parsed = converter.draftToParsed(draft);
            if (parsed == null) {
                callback("Can't save draft", null);
                return;
            }

            async.parallel({
                fs : function(callback) {
                    var path = null;
                    if (draft.sent) {
                        path = utils.messageParsedPath(draft.id);
                    } else {
                        path = utils.draftPath(userHash, draft.id);
                    }
                    utils.writeToFile(path, parsed, callback);
                },
                solr : function(callback) {
                    indexDraft(draft, callback);
                }
            }, function(err, results) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var path = results.fs;

                if (draft.sent) {
                    console.info("Sending draft as a message");

                    if (draft.in_reply_to_mid) {
                        //FIXME: create a new thread and update previous message 
                    }

                    utils.pushToQueue("sent", draft.id);

                    callback(null, {status : 'ok', mid : draft.id});
                } else {
                    console.info("Sending back ", draft);
                    callback(null, draft);
                }
            });

        }
    }
}

function readDraftFromFile(path, callback) {
    if (fs.existsSync(path)) {
        var fd = fs.openSync(path, 'r');
        fs.flock(fd, 'ex', function(err) {
            if (err) {
                log.error("Can't lock a file " + path, err);
                callback(err, null);
                return;
            }
            var data = fs.readFileSync(path, 'utf8');
            callback(null, JSON.parse(data));

            fs.flock(fd, 'un');
            fs.closeSync(fd);
        });
    } else {
        log.error("Requested path doesn't exists path=" + path);
        callback("Path " + path + " doesn't exists!", null);
    }
}

function indexDraft(draft, callback) {
    if (draft && draft.id) {
        solrUtils.getMessage(draft.account, draft.id, function(err, result) {
            if (err) {
                log.error("Can't retrieve a draft: " + draft.id, err);
                callback(err, null);
                return;
            }

            draft.labels = draft.labels || [];

            if (draft.sent) {
                if (draft.labels.indexOf(LABELS.sent) < 0) {
                    draft.labels.push(LABELS.sent);
                }
                draft.labels = draft.labels.filter(function(label) {
                    return label != LABELS.draft;
                });
            } else {
                if (draft.labels.indexOf(LABELS.draft) < 0) {
                    draft.labels.push(LABELS.draft);
                }
            }

            solrUtils.indexMessage(converter.draftToDoc(draft), callback);
        });
    } else {
        callback("No draft id to search for", null);
    }
}

module.exports = {
    DraftStore : DraftStore
}
