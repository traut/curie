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

            async.waterfall([
                function(_callback) {
                    log.info("Deleting " + draft.id + ". Getting message");
                    solrUtils.getMessage(userHash, draft.id, _callback);
                },
                function(message, _callback) {
                    log.info("Deleting " + draft.id + ". Deleting from index");
                    solrUtils.deleteMessage(draft.id, _callback);
                },
                function(message, _callback) {
                    log.info("Deleting " + draft.id + ". Deleting from FS");
                    utils.deleteFile(utils.draftPath(userHash, draft.id), _callback);
                }
            ], function(err) {
                callback(err, null);
            });

        },
        updateDraft : function(handshake, options, callback) {
            var draft = options.item;

            var userHash = handshake.session.user.hash;
            var userEmails = handshake.session.user.mailboxes;

            draft.id = draft.id || utils.uniqueId();
            draft.account = userHash;
            draft.to = draft.to || [];
            draft.cc = draft.cc || [];
            draft.bcc = draft.bcc || [];
            draft.unread = false;
            draft.attachment = draft.attachment || [];
            draft.threads = draft.threads || [];
            draft.currentThread = draft.currentThread || null;
            draft.received = new Date();
            draft.body = draft.body || [];

            if (draft.from) {
                var correct = userEmails.all.filter(function(m) {
                    return m.email == draft.from.email;
                }).length > 0;

                if (!correct) {
                    draft.from = userEmails.primary;
                }
            } else {
                draft.from = userEmails.primary;
            }

            draft.__message_id = (draft.sent) ? utils.createMessageId(draft.id) : ('dummy' + draft.id);

            var parsed = converter.draftToParsed(draft);
            if (parsed == null) {
                log.error("Error with", draft);
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
    if (!draft || !draft.id) {
        callback("No draft id to search for", null);
    }

    async.waterfall([
        function(_callback) { // checking if the draft is there
            solrUtils.getMessage(draft.account, draft.id, _callback); 
        },
        function(message, _callback) { // filling labels properly
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
            _callback();
        },
        function(_callback) {
            if (!draft.in_reply_to_mid || draft.in_reply_to_mid == '') {
                _callback();
                return;
            }

            log.info("Creating new thread with draft=" + draft.id + ", message=" + draft.in_reply_to_mid);

            solrUtils.getMessage(draft.account, draft.in_reply_to_mid, function(err, parentMessage) {
                if (!parentMessage) {
                    draft.currentThread = null;
                    _callback();
                    return;
                }

                if (!draft.currentThread) {
                    if (parentMessage.threads && parentMessage.threads.length > 0) {
                        draft.currentThread = parentMessage.threads[0];
                        draft.threads = parentMessage.threads;
                    } else {
                        draft.currentThread = utils.uuid();
                        draft.threads = [];
                    }
                }

                if (!draft.threads || draft.threads.length == 0) {
                    draft.threads = [draft.currentThread];
                } else if (draft.threads.indexOf(draft.currentThread) == -1) {
                    draft.threads.push(draft.currentThread);
                }

                if (!parentMessage.threads || parentMessage.threads.indexOf(draft.currentThread) == -1) {
                    log.info("Updating message " + parentMessage.id + " with thread " + draft.currentThread);
                    solrUtils.updateMessage(parentMessage.id, {
                        threads : {add : draft.currentThread},
                    }, _callback);
                } else {
                    _callback();
                }
            });

        }], function(err) {
            if (err) {
                log.error("Can't index a draft: " + draft.id, err);
                callback(err, null);
                return;
            }
            solrUtils.indexMessage(converter.draftToDoc(draft), callback);
        }
    );
}

module.exports = {
    DraftStore : DraftStore
}
