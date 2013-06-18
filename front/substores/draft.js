var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');

var log = utils.getLogger("store.draft");

DraftStore = function() {
    return {
        getDraft : function(handshake, options, callback) {
            var draftId = options.draftId;

            if (!draftId) {
                callback("No draftId specified", null);
                return;
            }
            var path = utils.draftPath(handshake.session.user.email, draftId);

            //FIXME: possible security hole
            readDraftFromFile(path, function(err, result) {
                if (err) {
                    callback(err, null);
                    return;
                }
                console.info(result);
                callback(null, result);
            });
        },
        updateDraft : function(handshake, options, callback) {
            var draftId = options.draftId,
                msg = options.item;

            var fromEmail = handshake.session.user.email;

            if (!draftId) {
                log.info("new draft received", msg, {});
                draftId = crypto.createHash('md5').update(msg + "").digest("hex");
            }

            var path = utils.draftPath(fromEmail, draftId);

            writeDraftToFile(path, msg, function(err) {
                if (err) {
                    callback(err, null);
                    return;
                }
                console.info("File " + path + " created");
                callback(null, {success : true});
            });

            //FIXME

        }
    }
}

function writeDraftToFile(path, item, callback) {
    var body = JSON.stringify(item, null, 4);

    var fd = fs.openSync(path, 'w');
    fs.flock(fd, 'ex', function(err) {
        if (err) {
            log.error("Can't lock a file " + path, err);
            callback(err, null);
            return;
        }
        fs.writeFileSync(path, body);
        callback(null, null);

        fs.flock(fd, 'un');
        fs.closeSync(fd);
    });

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

module.exports = {
    DraftStore : DraftStore
}
