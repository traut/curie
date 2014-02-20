var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),
    solrUtils = require('../solrUtils'),

    settings = require('../settings'),
    utils = require('../utils'),

    messageStore = require('./message.js');


var log = utils.getLogger("store.attachment");

AttachmentStore = function() {
    return {
        getPreview : function(handshake, options, callback) {
            var user = handshake.session.user.hash,
                attachmentId = options.attachmentId,
                messageId = options.messageId;

            if (!messageId || !attachmentId) {
                log.error("No messageId or attachmentId");
                callback("No message id or attachment id");
                return;
            }

            solrUtils.getMessage(user, messageId, function(err, message) {
                if (err) {
                    log.error("No access to " + messageId);
                    callback(err, null);
                    return;
                }
                var path = utils.attachmentPath(messageId, attachmentId);

                if (!fs.existsSync(path)) {
                    callback("File " + path + " dosn't exist");
                    return;
                }


                async.parallel({
                    stats : function(callback) {
                        fs.stat(path, callback); 
                    },
                    mime : function(callback) {
                        utils.mime.detectFile(path, callback);
                    }
                }, function(err, results) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    var filetype = results.mime;
                    var filesize = results.stats.size;

                    var reply = {
                        id : attachmentId,
                        filetype : filetype,
                        filesize : filesize,
                        messageId : messageId,
                    };

                    utils.createThumbnail(path, filetype, function(err, thumbnail) {
                        if (err) {
                            callback(null, reply);
                            return;
                        }
                        readAndSend(thumbnail, reply, callback);
                    });
                });
            });
            

        },
        getAttachment : function(handshake, options, callback) {
            var user = handshake.session.user.hash,
                attachment = options.attachmentId + ".attachment",
                messageId = options.messageId;

            if (!messageId || !options.attachmentId) {
                log.error("No messageId or attachmentId");
                callback("No message id or attachment id");
                return;
            }

        }
    }
};

function getAttachment(userHash, messageId, attachmentId, callback) {
    messageStore.getFullMessage(userHash, messageId, function(err, message) {
        if (err) {
            log.error("No access to " + messageId + " for " + user);
            callback(403, null);
            return;
        }

        var attachments = message.attachments.filter(function(a) { return (a.file == attachmentId); });

        if (attachments.length == 0) {
            log.error("Attachment " + attachmentId + " for message " + messageId + " doesn't exist");
            callback(404);
            return;
        }

        var attachment = attachments[0];
        var attachmentPath = utils.attachmentPath(message.id, attachment.file);

        utils.mime.detectFile(attachmentPath, function(err, result) {
            callback(null, {
                headers : {
                    "Content-Disposition": 'attachment; filename="' + attachment.filename + '"',
                    "Content-Type" : result
                },
                path : attachmentPath
            });
        });
    });
}

function readAndSend(filepath, reply, _callback) {
    log.debug("Sending " + filepath);
    if (!fs.existsSync(filepath)) {
        _callback("File " + filepath + " doesn't exist");
        return;
    }
    fs.readFile(filepath, function (err, data) {
        reply.thumbnail = new Buffer(data, 'binary').toString('base64');
        _callback(null, reply);
    });
}

module.exports = {
    AttachmentStore : AttachmentStore,
    getAttachment : getAttachment
}
