var settings = require('./settings'),
    utils = require('./utils'),
    solrLib = require('./solr'),
    extend = require("xtend"),
    converter = require('./converter');

var log = utils.getLogger("solrUtils");
    solr = solrLib.createClient(),
    _escape = solrLib.valueEscape;

function accessControlQueryPart(accountHash) {
    return ' +account:' + _escape(accountHash) + ' ';
}

function getMessage(account, messageId, callback) {
    solr.get("get?id=" + messageId, function(err, response) {
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

function updateMessage(messageId, patch, callback) {
    var data = extend(patch, {
        id : messageId,
    });
    solr.updateJson([data], function(err) {
        solr.commit(function(err) {
            if (err) {
                callback(err, null);
                return;
            }
            log.info("solr.update/commit successful id=" + messageId);
            callback();
        });
    });
}

function indexMessage(message, callback) {
    solr.add(message, function(err) {
        if (err) {
            log.error("Can't add a doc " + message.id + ". Error: " + err);
            callback(err, null);
            return;
        }
        solr.commit(function(err) {
            if (err) {
                callback(err, null);
                return;
            }
            log.info("solr.add/commit successful id=" + message.id);
            callback(null, message)
        });
    });
}

function deleteMessage(messageId, callback) {
    solr.del(messageId, null, function(err) {
        if (err) {
            log.error("Can't delete a doc", {docId : messageId, err: err});
            callback(err, null);
            return;
        }
        solr.commit(function(err) {
            if (err) {
                callback(err, null);
                return;
            }
            log.info("Delete for " + messageId + " successful");
            callback()
        });
    });
}

module.exports = {
    query : function(query, data, callback) {
        return solr.query(query, data, function(err, response) {
            if (err) {
                callback(err, null);
                return;
            }
            var responseObj = JSON.parse(response);
            callback(null, responseObj);
        });
    },
    accessControl : accessControlQueryPart,
    getMessage : getMessage,
    indexMessage : indexMessage,
    updateMessage : updateMessage,
    deleteMessage : deleteMessage
}
