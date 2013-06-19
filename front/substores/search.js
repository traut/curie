var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');

var log = utils.getLogger("store.search");

SearchStore = function() {
    return {
        getSearch : function(handshake, options, callback) {
            var searchQuery = options.ctx.query,
                format = options.ctx.format;

            //FIXME: security hole
            var query = utils.accessControl(handshake.session.user.email) + searchQuery; //solrLib.valueEscape(searchQuery);

            log.info("Getting search for searchQuery=" + query);

            var numRows = (format == 'light') ? 0 : settings.NUM_ROWS;

            utils.solr.query(query, {
                rows : numRows,
                facet : true,
                'facet.field' : 'unread',
                sort : 'received desc'
            }, function(err, response) {
                if (err) {
                    log.error("Error " + err);
                    callback(err, null);
                    return;
                }
                var responseObj = JSON.parse(response);
                var messages = [];
                var unreadCounts = {};
                if (responseObj.response.docs && responseObj.response.docs.length > 0) {
                    messages = responseObj.response.docs.map(utils.emailFromDoc);
                    unreadCounts = utils.flatToDict(responseObj.facet_counts.facet_fields.unread);
                }

                var response = {
                    id : crypto.createHash('md5').update(query).digest("hex"),
                    query : searchQuery,
                    messages : messages,
                    size : responseObj.response.numFound,
                    unread : unreadCounts[true] || 0,
                }
                log.info("Found " + responseObj.response.numFound + " docs, query=" + query);
                callback(null, response);
            });
        },
    }
}

module.exports = {
    SearchStore : SearchStore
}
