var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');
    solrUtils = require('../solrUtils');
    converter = require('../converter');

var log = utils.getLogger("store.draft");

DraftStore = function() {
    return {
        getDraft : function(handshake, options, callback) {
            var draftId = options.draftId;
            var userHash = handshake.session.user.hash;

            if (!draftId) {
                callback("No draftId specified", null);
                return;
            }
            var path = utils.draftPath(userHash, draftId);

            async.parallel({
                fs : function(callback) {
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
        updateDraft : function(handshake, options, callback) {
            var draft = options.item;
            var userHash = handshake.session.user.hash;

            draft.id = draft.id || utils.uniqueId();
            draft.account = userHash;
            draft.__message_id = utils.createMessageId(draft.id);
            draft.__references = (draft.in_reply_to == null || draft.in_reply_to == '') ? [] : [draft.in_reply_to];
            draft.body = [{ type : "text", value : draft.body }];

            async.parallel({
                fs : function(callback) {
                    var parsed = converter.draftToParsed(draft);
                    if (parsed == null) {
                        callback("Can't save draft", null);
                        return;
                    }
                    utils.writeToFile(
                        utils.draftPath(userHash, draft.id),
                        parsed,
                        callback);
                },
                solr : function(callback) {
                    indexDraft(draft, callback);
                }
            }, function(err, results) {
                console.info("HERE");
                if (err) {
                    callback(err, null);
                    return;
                }
                var path = results.fs;
                console.info("Sending back ", draft);
                callback(null, draft);
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

            solrUtils.indexMessage(converter.draftToDoc(draft), callback);
        });
    } else {
        callback("No draft id to search for", null);
    }
}

module.exports = {
    DraftStore : DraftStore
}
