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
            callback(null, handshake.session.user.mailboxes);
        }
    }
};

module.exports = {
    AccountStore : AccountStore
}
