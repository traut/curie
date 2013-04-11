var util = require('util'),
    barista = require('barista'),
    solr = require('solr'),
    winston = require('winston'),
    isodate = require("isodate");

var solr = solr.createClient();

var router = new barista.Router();

router.match('/pack/:pack/messages', 'GET').to('packStore.getMessages');
router.match('/pack/:pack/messages/:messageId', 'GET').to('packStore.getMessage');

PackStore = function() {
    return {
        getMessages : function(handshake, options, callback) {
            var pack = options.pack;
            var toEmail = handshake.user.email;

            winston.info("Searching for pack=" + pack + ", toEmail=" + toEmail);

            readLabel(toEmail, pack, function(docs) {
                winston.info("Docs found: " + docs.length);
                var msgs = docs.map(function(doc) {
                    return {
                        id : doc.id,
                        from_name: doc.header_from_name,
                        from_email: doc.header_from_email,
                        to_name: doc.header_to_name,
                        to_email: doc.header_to_email,
                        subject: doc.header_subject,
                        received: isodate(doc.received).getTime(),
                        unread: doc.unread,
                        labels: doc.labels
                    }
                });
                callback(msgs);
            });
        },
        getMessage : function(options) {
            winston.info("Getting message", options.id);
        }
    }
};

var stores = {
    packStore : PackStore()
}

function readLabel(toEmail, label, callback){
    var query = util.format("+labels:%s +header_to_email:%s", label, toEmail)
    solr.query(query, {
        sort: "received desc",
    }, function(err, response) {
        if (err) throw err;
        var responseObj = JSON.parse(response);
        winston.info("query=" + query + ", results.length=" + responseObj.response.docs.length);
        callback(responseObj.response.docs);
    });
}


var create = function (socket, cast) {
    var e = eventSignature('create', cast), data = [];
    socket.emit(e, {id : 1});            
};
 
var read = function (socket, cast) {
    var params = router.first(cast.url, 'GET');
    stores[params.controller][params.action](socket.handshake, params, function(results) {
        socket.emit(eventSignature('read', cast), results);
    });
};
 
var update = function (socket, cast) {
    var e = eventSignature('update', cast), data = [];
    socket.emit(e, {success : true});            
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
 
module.exports = {
    create : create,
    read : read,
    update : update,
    destroy : destroy
}
