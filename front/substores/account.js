var isodate = require("isodate"),
    crypto = require('crypto'),
    async = require('async'),

    settings = require('../settings'),
    users = require('../users'),
    utils = require('../utils'),
    filters = require('../filters'),
    converter = require('../converter');

var log = utils.getLogger("store.account");


AccountStore = function() {
    return {
        getAccountDetails : function(handshake, options, callback) {
            callback(null, handshake.session.user.mailboxes);
        },
        getFilters : function(handshake, options, callback) {
            var account_hash = handshake.session.user.hash;

            filters.getFilters(account_hash, callback);
        },
        rerunFilter : function(handshake, options, callback) {
            var account_hash = handshake.session.user.hash,
                filterId = options.item.id;

            filters.rerunFilter(account_hash, filterId);
            filters.getFilter(account_hash, filterId, function(err, filter) {
                if (filter) {
                    filter.rerun = true;
                }
                callback(err, filter);
            });
        },
        addFilter : function(handshake, options, callback) {
            var account_hash = handshake.session.user.hash,
                query = options.item.query,
                label = options.item.label,
                skipInbox = options.item.skipInbox;

            filters.addFilter(account_hash, query, label, skipInbox, callback);
        },
        deleteFilter : function(handshake, options, callback) {
            var account_hash = handshake.session.user.hash,
                id = options.item.id;

            filters.deleteFilter(account_hash, id, callback);
        },
    }
};

module.exports = {
    AccountStore : AccountStore
}
