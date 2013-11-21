var isodate = require("isodate"),
    crypto = require('crypto'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils'),
    solrUtils = require('../solrUtils'),
    converter = require('../converter');

var log = utils.getLogger("store.pack");


PackStore = function() {
    return {
        getMessagePreviews : function(handshake, options, callback) {
            var pack = options.pack;
            var hash = handshake.session.user.hash;
            var page = options.ctx.page || 0;

            log.info("Searching for pack=" + pack + ", page=" + page + ", hash=" + hash);

            function getThreads(messages) {
                return messages.filter(function(m) {
                    return m.thread;
                });
            }

            queryForLabel(hash, pack, page, function(err, docs) {
                if (err) {
                    callback(err, []);
                    return;
                }
                var msgs = [];
                if (docs && docs.length > 0) {
                    msgs = docs.map(converter.solrToEmailPreview);
                    msgs = utils.mergeIntoThreads(msgs);
                }

                var threadIds = getThreads(msgs).map(function(m) {
                    return m.id;
                });

                if (threadIds.length == 0) {
                    callback(null, msgs);
                    return;
                };

                var query = '+labels:*' + solrUtils.accessControl(hash);
                solrUtils.query(query, {
                    facet : true,
                    'facet.query' : threadIds.map(function(id) { return "threads:" + id; }), 
                    rows : 0,
                }, function(err, results) {
                    var counts = results.facet_counts.facet_queries;
                    getThreads(msgs).forEach(function(t) {
                        t.length = counts["threads:" + t.id];
                    });
                    callback(null, msgs);
                });

            });
        },
        getPacks : function(handshake, options, callback) {
            var hash = handshake.session.user.hash;
            log.info("Getting packs list for " + hash);

            async.parallel({
                packs : function(callback) {
                    solrUtils.query(solrUtils.accessControl(hash), {
                        rows: 0,
                        facet: true,
                        'facet.field' : "labels"
                    }, callback);
                },
                unreadCounts : function(callback) {
                    var query = "+unread:true " + solrUtils.accessControl(hash);
                    solrUtils.query(query, {
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
                var packsResult = results.packs;
                var unreadsResult = results.unreadCounts;

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

            var query = "+labels:" + packName + solrUtils.accessControl(handshake.session.user.hash);

            var facetQuery = query + " +unread:true";

            async.parallel({
                groups : function(callback) {
                    solrUtils.query(query, {
                        rows : settings.NUM_GROUPS, 
                        group : true,
                        'group.field' : groupByFieldRealName,
                        'group.limit' : settings.NUM_ROWS_IN_GROUP,
                        'group.sort' : 'received desc'
                    }, callback);
                },
                unreadCounts : function(callback) {
                    solrUtils.query(facetQuery, {
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
    var query = '+labels:' + label + solrUtils.accessControl(hash);

    var amount = settings.NUM_ROWS;
    var start = amount * page;

    solrUtils.query(query, {
        sort : "received desc",
        start : start,
        rows : amount,
    }, function(err, results) {
        if (err) {
            log.error("Error when querying query=" + query + ": %s", err, {});
            callback(err, null);
            return;
        }
        log.info("query=" + query + ", start=" + start + ", amount=" + amount + ", results.length=" + results.response.docs.length);
        callback(null, results.response.docs);
    });
}


module.exports = {
    PackStore : PackStore
}
