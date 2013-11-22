var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');
    solrUtils = require('../solrUtils');
    converter = require('../converter');

var log = utils.getLogger("store.search");

SearchStore = function() {
    return {
        getSearch : function(handshake, options, callback) {
            var searchQuery = options.ctx.query,
                page = options.ctx.page || 0;

            console.info(options);

            //FIXME: security hole, no searchQuery validation
            var query = solrUtils.accessControl(handshake.session.user.hash) + searchQuery; //solrLib.valueEscape(searchQuery);

            log.info("Getting search for searchQuery=" + query + ", page=" + page);

            var amount = settings.NUM_ROWS;
            //var numRows = (format == 'light') ? 0 : settings.NUM_ROWS;

            solrUtils.query(query, {
                facet : true,
                'facet.field' : 'unread',
                sort : 'received desc',

                start : amount * page,
                rows : amount,
            }, function(err, results) {
                if (err) {
                    log.error("Error " + err);
                    callback(err, null);
                    return;
                }
                var messages = [];
                var unreadCounts = {};
                if (results.response.docs && results.response.docs.length > 0) {
                    messages = results.response.docs.map(converter.solrToEmailPreview);
                    unreadCounts = utils.flatToDict(results.facet_counts.facet_fields.unread);
                }

                var response = {
                    id : crypto.createHash('sha512').update(searchQuery).digest("hex"),
                    query : searchQuery,
                    unread : unreadCounts[true] || 0,

                    page : page,
                    total : results.response.numFound,
                    docs : messages,
                }
                log.info("Found " + results.response.numFound + " docs, query=" + query);
                callback(null, response);
            });
        },
    }
}

module.exports = {
    SearchStore : SearchStore
}
