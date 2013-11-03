var isodate = require("isodate"),
    crypto = require('crypto'),
    async = require('async'),

    settings = require('../settings');
    utils = require('../utils');
    converter = require('../converter');

var log = utils.getLogger("store.pack");


PackStore = function() {
    return {
        getMessagePreviews : function(handshake, options, callback) {
            var pack = options.pack;
            var hash = handshake.session.user.hash;

            log.info("Searching for pack=" + pack + "; hash=" + hash);

            var page = 1;

            queryForLabel(hash, pack, page, function(err, docs) {
                if (err) {
                    callback(err, []);
                    return;
                }
                var msgs = [];
                if (docs && docs.length > 0) {
                    msgs = docs.map(converter.solrToEmailPreview);
                }
                msgs = utils.mergeToThreads(msgs);
                callback(null, msgs);
            });
        },
        getPacks : function(handshake, options, callback) {
            var hash = handshake.session.user.hash;
            log.info("Getting packs list for " + hash);

            async.parallel({
                packs : function(callback) {
                    utils.solr.query(utils.accessControl(hash), {
                        rows: 0,
                        facet: true,
                        'facet.field' : "labels"
                    }, callback);
                },
                unreadCounts : function(callback) {
                    var query = "+unread:true " + utils.accessControl(hash);
                    utils.solr.query(query, {
                        rows: 0,
                        facet: true,
                        'facet.field' : "labels"
                    }, callback);
                }
            }, function(err, results) {
                log.info("results", results, {});
                if (err) {
                    log.error("Error " + err);
                    callback(err, null);
                    return;
                }
                var packsResult = JSON.parse(results.packs);
                var unreadsResult = JSON.parse(results.unreadCounts);

                var labelsMap = utils.flatToDict(packsResult.facet_counts.facet_fields.labels);
                var unreadsMap = utils.flatToDict(unreadsResult.facet_counts.facet_fields.labels);

                var packs = [];
                Object.keys(labelsMap).forEach(function(key) {
                    if (key == "draft") { // skipping predefined
                        return;
                    }
                    packs.push({
                        id : crypto.createHash('md5').update(key).digest("hex"),
                        name : key,
                        size : labelsMap[key],
                        unread : unreadsMap[key]
                    });
                });
                callback(null, packs);
            });
        },
        getGroups : function(handshake, options, callback) {
            var packName = options.pack,
                groupField = options.groupField;

            log.info("Getting groups for pack=" + packName + ", groupField=" + groupField + "; user=" + handshake.session.user.hash);

            var groupFieldMapping = {
                from : 'from.email',
            };

            var groupByFieldRealName = groupFieldMapping[groupField];

            var query = "+labels:" + packName + utils.accessControl(handshake.session.user.hash);

            var facetQuery = query + " +unread:true";

            async.parallel({
                groups : function(callback) {
                    utils.solr.query(query, {
                        rows : settings.NUM_GROUPS, 
                        group : true,
                        'group.field' : groupByFieldRealName,
                        'group.limit' : settings.NUM_ROWS_IN_GROUP,
                        'group.sort' : 'received desc'
                    }, callback);
                },
                unreadCounts : function(callback) {
                    utils.solr.query(facetQuery, {
                        rows : 0,
                        facet : true,
                        'facet.field' : groupByFieldRealName,
                    }, callback);
                }
            }, function(err, results) {
                if (err) {
                    log.error("Error " + err);
                    callback(err, null);
                    return;
                }
                var groupsResult = JSON.parse(results.groups);
                if (groupsResult.grouped[groupByFieldRealName].matches == 0) {
                    callback(null, []);
                }
                var unreadResult = JSON.parse(results.unreadCounts);
                var unreadCounts = utils.flatToDict(unreadResult.facet_counts.facet_fields[groupByFieldRealName]);

                var groups = groupsResult.grouped[groupByFieldRealName].groups.map(function(group) {
                    return {
                        id : crypto.createHash('md5').update(group.groupValue).digest("hex"),
                        value : group.groupValue,
                        groupBy : groupField,
                        pack : packName,
                        size : group.doclist.numFound,
                        unread : unreadCounts[group.groupValue] || null,
                        topMessages : group.doclist.docs.map(converter.solrToEmailPreview),
                    };
                }, this);
                callback(null, groups);
            });
        },
    }
};


function queryForLabel(hash, label, page, callback){
    var query = '+labels:' + label + utils.accessControl(hash);

    var amount = settings.NUM_ROWS;

    utils.solr.query(query, {
        sort : "received desc",
        start : amount * (page - 1),
        rows : amount,
    }, function(err, response) {
        if (err) {
            log.error("Error when querying query=" + query + ": %s", err, {});
            callback(err, null);
            return;
        }
        var responseObj = JSON.parse(response);
        log.info("query=" + query + ", results.length=" + responseObj.response.docs.length);
        callback(null, {
            fullSize : responseObj.response.numFound,
            page : page,
            messages : responseObj.response.docs
        });
    });
}


module.exports = {
    PackStore : PackStore
}
