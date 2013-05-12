var util = require('util'),
    barista = require('barista'),
    solrLib = require('solr'),
    winston = require('winston'),
    isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs'),
    async = require('async');

var STORAGE_PATH = "/home/curie/storage/";

var MAIL_ACCESS_MAP = {
    "t@curie.heyheylabs.com" : ["t@curie.heyheylabs.com", "dev@arrr.tv", "webmaster@arrr.tv"],
    "some@curie.heyheylabs.com" : ["some@curie.heyheylabs.com"]
}

var NUM_ROWS = 30;
var NUM_GROUPS = 10;
var NUM_ROWS_IN_GROUP = 5;


var solr = solrLib.createClient();

var router = new barista.Router();

router.match('/messages/:messageId', 'GET').to('packStore.getMessage');
router.match('/messages/:messageId', 'PATCH').to('packStore.patchMessage');

router.match('/packs', 'GET').to('packStore.getPacks');
router.match('/packs/:pack/messages', 'GET').to('packStore.getMessagePreviews');

router.match('/packs/:pack/groups/:groupfield', 'GET').to('packStore.getGroups');

router.match('/packs/:pack/search/:searchfield/:searchvalue', 'GET').to('packStore.getSearch').where({
    searchvalue : /.+$/
});

PackStore = function() {
    return {
        getMessagePreviews : function(handshake, options, callback) {
            var pack = options.pack;
            var toEmail = handshake.session.email;

            winston.info("Searching for pack=" + pack + ", toEmail=" + toEmail);

            queryForLabel(toEmail, pack, function(err, docs) {
                if (err) {
                    callback(err, []);
                    return;
                }
                var msgs = docs.map(emailFromDoc);
                callback(null, msgs);
            });
        },
        getMessage : function(handshake, options, callback) {
            var mid = options.messageId;
            var toEmail = handshake.session.email;

            winston.info("Reading message", mid);

            var path = STORAGE_PATH + mid.substring(0, 2) + "/" + mid.substring(2, 4) + "/" + mid.substring(4, 6) + "/" + mid + ".json";

            async.parallel({
                fs : function(callback) {
                    readMessageFromFile(path, callback);
                },
                solr : function(callback) {
                    queryForMessage(mid, callback);
                }
            }, function(err, results) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var email = emailFromDoc(results.solr);
                email.body = results.fs.body;
                callback(null, email);
                winston.info("Message " + mid + " was send");
            });
        },
        patchMessage : function(handshake, options, callback) {
            winston.info("Patching message with params", options);
            var changed = options.changed;
            changed.id = options.messageId;

            var mid = options.messageId;

            queryForMessage(mid, function(err, doc) {
                if (err) {
                    callback(err, null);
                    return;
                }
                for(var key in options.changed) {
                    doc[key] = options.changed[key];
                }
                doc["_version_"] = 1; // document must exist
                solr.add(doc, function(err) {
                    if (err) {
                        winston.error("Can't add a doc", {doc : doc, err: err});
                        callback(err, null);
                        return;
                    }
                    solr.commit(function(err) {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        winston.info("Update successful mid=" + mid);
                        callback(null, null);
                    });
                });
            });
        },
        getPacks : function(handshake, options, callback) {
            winston.info("Getting packs list for " + handshake.session.email);
            async.parallel({
                packs : function(callback) {
                    solr.query(accessControlQueryPart(handshake.session.email), {
                        rows: 0,
                        facet: true,
                        'facet.field' : "labels"
                    }, callback);
                },
                unreadCounts : function(callback) {
                    var query = "+unread:true " + accessControlQueryPart(handshake.session.email);
                    solr.query(query, {
                        rows: 0,
                        facet: true,
                        'facet.field' : "labels"
                    }, callback);
                }
            }, function(err, results) {
                if (err) {
                    winston.error("Error %s", err);
                    callback(err, null);
                    return;
                }
                var packsResult = JSON.parse(results.packs);
                var unreadsResult = JSON.parse(results.unreadCounts);

                var labelsMap = flatToDict(packsResult.facet_counts.facet_fields.labels);
                var unreadsMap = flatToDict(unreadsResult.facet_counts.facet_fields.labels);

                var packs = [];
                Object.keys(labelsMap).forEach(function(key) {
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
                groupField = options.groupfield;

            winston.info("Getting groups for pack=" + packName + ", groupField=" + groupField + ", user=" + handshake.session.email);

            var groupFieldMapping = {
                from : 'header_from_email_raw',
            };

            var groupByFieldRealName = groupFieldMapping[groupField];

            var query = "+labels:" + packName + accessControlQueryPart(handshake.session.email);

            var facetQuery = query + " +unread:true";

            //+unread:true +( header_to_email:"t@curie.heyheylabs.com" header_to_email:"dev@arrr.tv" header_to_email:"webmaster@arrr.tv")
            async.parallel({
                groups : function(callback) {
                    solr.query(query, {
                        rows : NUM_GROUPS, 
                        group : true,
                        'group.field' : groupByFieldRealName,
                        'group.limit' : NUM_ROWS_IN_GROUP,
                        'group.sort' : 'received desc'
                    }, callback);
                },
                unreadCounts : function(callback) {
                    solr.query(facetQuery, {
                        rows : 0,
                        facet : true,
                        'facet.field' : groupByFieldRealName,
                    }, callback);
                }
            }, function(err, results) {
                if (err) {
                    winston.error("Error %s", err);
                    callback(err, null);
                    return;
                }
                var groupsResult = JSON.parse(results.groups);
                if (groupsResult.grouped[groupByFieldRealName].matches == 0) {
                    callback(null, []);
                }
                var unreadResult = JSON.parse(results.unreadCounts);
                var unreadCounts = flatToDict(unreadResult.facet_counts.facet_fields[groupByFieldRealName]);

                var groups = groupsResult.grouped[groupByFieldRealName].groups.map(function(group) {
                    return {
                        id : crypto.createHash('md5').update(group.groupValue).digest("hex"),
                        value : group.groupValue,
                        groupBy : groupField,
                        pack : packName,
                        size : group.doclist.numFound,
                        unread : unreadCounts[group.groupValue] || null,
                        topMessages : group.doclist.docs.map(emailFromDoc),
                    };
                }, this);
                callback(null, groups);
            });
        },
        getSearch : function(handshake, options, callback) {
            var packName = options.pack,
                searchField = options.searchfield,
                searchValue = options.searchvalue,
                format = options.format;


            var searchFieldMapping = {
                from : 'header_from_email_raw',
            };

            var searchByFieldRealName = searchFieldMapping[searchField];

            var query = "+labels:" + packName + accessControlQueryPart(handshake.session.email);
            query += util.format(' +%s:"%s"', searchByFieldRealName, solrLib.valueEscape(searchValue));

            winston.info("Getting search for pack=" + packName + ", searchField=" + searchField + ", searchValue=" + searchValue + ", query=" + query);

            var numRows = (format == 'light') ? 0 : NUM_ROWS;

            solr.query(query, {
                rows : numRows,
                facet : true,
                'facet.field' : 'unread',
                sort : 'received desc'
            }, function(err, response) {
                if (err) {
                    winston.error("Error %s", err);
                    callback(err, null);
                    return;
                }
                var responseObj = JSON.parse(response);
                var messages = responseObj.response.docs.map(emailFromDoc);
                var unreadCounts = flatToDict(responseObj.facet_counts.facet_fields.unread);

                var response = {
                    id : crypto.createHash('md5').update(searchValue).digest("hex"),
                    pack : packName,
                    searchField : searchField,
                    searchValue : searchValue,
                    messages : messages,
                    size : responseObj.response.numFound,
                    unread : unreadCounts[true] || 0,
                }
                winston.info("Found " + responseObj.response.numFound + " docs, pack=" + packName + ", searchField=" + searchField + ", searchValue=" + searchValue);
                callback(null, response);
            });
        }
    }
};

var stores = {
    packStore : PackStore()
}

function accessControlQueryPart(email) {
    var query = " +(";
    for(i in MAIL_ACCESS_MAP[email]) {
        query += ' header_to_email:"' + solrLib.valueEscape(MAIL_ACCESS_MAP[email][i]) + '"';
    }
    query += ")";
    return query;
}

function queryForLabel(toEmail, label, callback){
    var email = solrLib.valueEscape(toEmail);


    var query = '+labels:' + label; // +header_to_email:"%s"', label, email);
    query += accessControlQueryPart(toEmail);


    solr.query(query, {
        sort: "received desc",
        rows: NUM_ROWS,
    }, function(err, response) {
        if (err) {
            winston.error("Error when querying query=" + query, err);
            callback(err, null);
            return;
        }
        var responseObj = JSON.parse(response);
        winston.info("query=" + query + ", results.length=" + responseObj.response.docs.length);
        callback(null, responseObj.response.docs);
    });
}

function queryForMessage(messageId, callback) {
    solr.get("get?id=" + messageId, function(err, response) {
        if (err) {
            callback(err, null);
            return;
        }
        var responseObj = JSON.parse(response);
        callback(null, responseObj.doc);
    });
}

function readMessageFromFile(path, callback) {
    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
              winston.error("Can't read a file " + path, err);
              callback(err, null);
              return;
            }
            var json = JSON.parse(data);
            callback(null, emailFromDoc(json));
        });
    } else {
        winston.error("Requested path doesn't exists path=" + path);
        callback("Path " + path + " doesn't exists!", null);
    }
}


var create = function (socket, cast) {
    winston.info("create", cast);
    var e = eventSignature('create', cast), data = [];
    socket.emit(e, {id : 1});            
};
 
var read = function (socket, cast) {
    if (!cast.url) {
        socket.emit("fail", "Badly formed request. No url parameter");            
        return
    }
    var params = router.first(cast.url, 'GET');
    if (!params) {
        winston.error("Can't get parse '" + cast.url + "'");
        socket.emit('err', null);
        return;
    }
    stores[params.controller][params.action](socket.handshake, params, function(err, results) {
        if (err) {
            socket.emit(eventSignature('err', cast), []); // FIXME: will not be handled properly on client-side
            return
        }
        socket.emit(eventSignature('read', cast), results);
    });
};
 
var update = function (socket, cast) {
    winston.info("update", cast);
    var e = eventSignature('update', cast), data = [];
    socket.emit(e, {success : true});            
};

var patch = function (socket, cast, changed) {
    var params = router.first(cast.url, 'PATCH');
    params.changed = changed;
    stores[params.controller][params.action](socket.handshake, params, function(err, result) {
        if (err) {
            socket.emit(eventSignature('err', cast), {success : false});
            return
        }
        socket.emit(eventSignature('patch', cast), {success : true});
    });
};
 
var destroy = function (socket, cast) {
    var e = eventSignature('delete', cast), data = [];
    socket.emit(e, {success : true});            
};
 
// creates the event to push to listening clients
var eventSignature = function (operation, cast) {
    var signature = operation + ':' + cast.url;
    if (cast.ctx) signature += (':' + cast.ctx);
    return signature;
};

function get_first(val) {
    if (val == null) {
        return null;
    } else if ( typeof val === 'string' || typeof val === 'boolean' ) {
        return val;
    } else {
        return val[0];
    }
}

function as_list(val) {
    if (val == null) {
        return [];
    } else if ( typeof val === 'string') {
        return [val];
    } else {
        return val;
    }
}

function emailFromDoc(doc) {
    return {
        id : get_first(doc.id),
        from_name : get_first(doc.header_from_name),
        from_email : get_first(doc.header_from_email),
        to_name : get_first(doc.header_to_name),
        to_email : get_first(doc.header_to_email),
        subject : get_first(doc.header_subject),
        received : isodate(get_first(doc.received)).getTime(),
        unread : get_first(doc.unread),
        labels : as_list(doc.labels),
        body : as_list(doc.body)
    }
}

function flatToDict(flatMap) {
    var result = {};
    if (!flatMap) {
        return result;
    }
    for (var i = 0; i < flatMap.length; i++) {
        if (i % 2 == 0) {
            result[flatMap[i]] = flatMap[i + 1];
        }
    };
    return result;
}
 
module.exports = {
    create : create,
    read : read,
    update : update,
    destroy : destroy,
    patch : patch
}
