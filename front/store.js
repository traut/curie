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


var solr = solrLib.createClient();

var router = new barista.Router();

router.match('/packs', 'GET').to('packStore.getPacks');
router.match('/packs/:pack/messages', 'GET').to('packStore.getMessagePreviews');
router.match('/packs/:pack/groups/:groupfield', 'GET').to('packStore.getGroups');
router.match('/messages/:messageId', 'GET').to('packStore.getMessage');
router.match('/messages/:messageId', 'PATCH').to('packStore.patchMessage');

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
            solr.query(accessControlQueryPart(handshake.session.email), {
                rows: 0,
                facet: true,
                'facet.field' : "labels"
            }, function(err, response) {
                if (err) {
                    winston.error("Error %s", err);
                    callback(err, null);
                    return;
                }
                //{"responseHeader":{"status":0,"QTime":1,"params":{"facet":"true","q":" +( header_to_email:\"t@curie.heyheylabs.com\" header_to_email:\"dev@arrr.tv\" header_to_email:\"webmaster@arrr.tv\")","facet.field":"labels","wt":"json","rows":"0"}},"response":{"numFound":8,"start":0,"docs":[]},"facet_counts":{"facet_queries":{},"facet_fields":{"labels":["inbox",8]},"facet_dates":{},"facet_ranges":{}}}
                var responseObj = JSON.parse(response);
                console.info(response, responseObj);
                callback(null, responseObj.response.facet_fields.labels);
            });
        },
        getGroups : function(handshake, options, callback) {
            var packName = options.pack,
                groupField = options.groupfield;

            winston.info("Getting groups for pack=" + packName + ", groupField=" + groupField + ", user=" + handshake.session.email);

            var groupFieldMapping = {
                from : 'header_from_email_raw',
            };

            if (packName == "inbox2") {
                packName = "inbox";
            }

            var groupByFieldRealName = groupFieldMapping[groupField];

            var query = "+labels:" + packName + accessControlQueryPart(handshake.session.email);
            solr.query(query, {
                group : true,
                rows : 10,
                'group.field' : groupByFieldRealName,
                'group.limit' : 5,
                'group.sort' : 'received desc'
            }, function(err, response) {
                if (err) {
                    winston.error("Error %s", err);
                    callback(err, null);
                    return;
                }
                winston.info("Response", response);
                var responseObj = JSON.parse(response);
                if (responseObj.grouped[groupByFieldRealName].matches == 0) {
                    callback(null, []);
                }
                //"groups":[{"groupValue":"sergey@polzunov.com","doclist":{"numFound":1,"start":0,"docs":[{"header_to_email":["t@curie.heyheylabs.com"],"received":"2013-04-27T00:01:24.5Z","labels":["inbox"],"header_orig_date":"2013-04-25T15:16:06Z","header_message_id":"<CABjC=OtioBKThux=4k9F4CGPzG2_2Jj2fSrLu_1s2x8B5wY=MA@mail.gmail.com>","header_from_name":["Sergey Polzunov"],"header_subject":"test email","id":"6520b20e817abff1b5685f8433d9016c0bee1cf55f0f6d413ee93b51cefd150f","header_from_email":"sergey@polzunov.com","header_from_email_raw":"sergey@polzunov.com","_version_":1433417849237405696,"indexed":"2013-04-26T22:03:07.49Z","unread":true}]}}
                var groups = responseObj.grouped[groupByFieldRealName].groups.map(function(group) {
                    return {
                        id : crypto.createHash('md5').update(group.groupValue).digest("hex"),
                        value : group.groupValue,
                        size : group.doclist.numFound,
                        topMessages : group.doclist.docs.map(emailFromDoc)
                    };
                }, this);
                callback(null, groups);
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
        rows: 30,
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
 
module.exports = {
    create : create,
    read : read,
    update : update,
    destroy : destroy,
    patch : patch
}
