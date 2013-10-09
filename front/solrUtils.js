var settings = require('./settings'),
    utils = require('./utils');
    converter = require('./converter');

var log = utils.getLogger("solrUtils");

function getMessage(account, messageId, callback) {
    utils.solr.get("get?id=" + messageId, function(err, response) {
        if (err) {
            callback(err, null);
            return;
        }
        var responseObj = JSON.parse(response);
        var message = responseObj.doc;
        if (message && message.account != account) {
            callback(utils.AccessDenied(account, "message", messageId), null);
            return;
        }
        callback(null, message);
    });
}

function indexMessage(message, callback) {
    utils.solr.add(message, function(err) {
        if (err) {
            log.error("Can't add a doc", {doc : message, err: err});
            callback(err, null);
            return;
        }
        utils.solr.commit(function(err) {
            if (err) {
                callback(err, null);
                return;
            }
            log.info("Update successful id=" + message.id);
            callback(null, message)
        });
    });
}

module.exports = {
    getMessage : getMessage,
    indexMessage : indexMessage
}
