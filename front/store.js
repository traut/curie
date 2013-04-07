var util = require('util'),
    Router = require('barista').Router,
    solr = require('solr'),
    util = require('util');

var solr = solr.createClient();

var router = new Router;

router.match('/pack/:pack/messages', 'GET').to('packStore.getMessages');
router.match('/pack/:pack/messages/:messageId', 'GET').to('packStore.getMessage');

PackStore = function() {
    var PACKS = {
        inbox : [
            {id: "someId1", from: 'yana.dobrunova@gmail.com', to: 'sergey@polzunov.com', subject: 'Hey, take a look at this!'},
        ],
        sent : [
            {id: "someId2", from: 'someone@gmail.com', to: 'anotherone@gmail.com', subject: 'This is a sent email!'},
        ]
    };
    return {
        getMessages : function(handshake, options, callback) {
            var pack = options.pack;
            var toEmail = handshake.user.email;

            console.info("Looking for messages in " + pack);

            readLabel(toEmail, pack, function(docs) {
                console.info(docs);
                var msgs = docs.map(function(doc) {
                    return {
                        id : doc.id,
                        from: formatEmail(doc.header_from_name, doc.header_from_email),
                        to: formatEmail(doc.header_to_name, doc.header_to_email),
                        subject: doc.header_subject,
                        received: doc.received
                    }
                });
                callback(msgs);
            });
        },
        getMessage : function(options) {
            var pack = options.pack;
            var messageId = options.messageId;
            var packObj = PACKS[pack] || [];
            for (var i = 0; i < packObj.length; i++) {
                if (packObj[i].id == messageId) {
                    return packObj[i];
                }
            }
        }
    }
};

var stores = {
    packStore : PackStore()
}

function formatEmail(name, email){
    if (email && name) {
        return util.format("%s <%s>", name, email);
    } else if (email) {
        return email;
    }
    throw "No email";
}

function readLabel(toEmail, label, callback){
    var query = util.format("+label:%s +header_to_email:%s", label, toEmail)
    solr.query(query, function(err, response) {
        if (err) throw err;
        var responseObj = JSON.parse(response);
        console.log('A search for "' + query + '" returned ' + responseObj.response.numFound + ' documents.');
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
