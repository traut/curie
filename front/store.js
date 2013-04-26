var util = require('util'),
    barista = require('barista'),
    solrLib = require('solr'),
    winston = require('winston'),
    isodate = require("isodate"),
    fs = require('fs'),
    async = require('async');

var STORAGE_PATH = "/home/curie/storage/";

var MAIL_ACCESS_MAP = {
    "t@curie.heyheylabs.com" : ["t@curie.heyheylabs.com", "dev@arrr.tv", "webmaster@arrr.tv"],
    "some@curie.heyheylabs.com" : ["some@curie.heyheylabs.com"]
}


var solr = solrLib.createClient();

var router = new barista.Router();

router.match('/pack/:pack/messages', 'GET').to('packStore.getMessagePreviews');
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
        }
    }
};

var stores = {
    packStore : PackStore()
}

function queryForLabel(toEmail, label, callback){
    var email = solrLib.valueEscape(toEmail);


    var query = '+labels:' + label; // +header_to_email:"%s"', label, email);

    query += " +(";
    for(i in MAIL_ACCESS_MAP[toEmail]) {
        query += ' header_to_email:"' + solrLib.valueEscape(MAIL_ACCESS_MAP[toEmail][i]) + '"';
    }
    query += ")";

    solr.query(query, {
        sort: "received desc",
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
