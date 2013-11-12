var isodate = require("isodate"),
    crypto = require('crypto'),
    async = require('async'),

    settings = require('../settings'),
    users = require('../users'),
    utils = require('../utils'),
    converter = require('../converter');

var log = utils.getLogger("store.account");


AccountStore = function() {
    return {
        getAccountDetails : function(handshake, options, callback) {
            var hash = handshake.session.user.hash;
            users.getAccountEmails(hash, function(err, emails) {
                if (err) {
                    callback(err);
                    return;
                }
                if (!emails || emails == null || emails.length == 0) {
                    callback("No emails for hash " + hash);
                    return;
                }
                console.info(emails);
                callback(null, {
                    email : emails[0].email,
                    name : "John Smith"
                });
            });
        }
    }
};

module.exports = {
    AccountStore : AccountStore
}
