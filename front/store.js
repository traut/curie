var util = require('util'),
    Router = require('barista').Router;

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
        getMessages : function(options) {
            var pack = options.pack;
            return PACKS[pack] || [];
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

var create = function (socket, cast) {
    var e = eventSignature('create', cast), data = [];
    socket.emit(e, {id : 1});            
};
 
var read = function (socket, cast) {
    var params = router.first(cast.url, 'GET');
    var results = stores[params.controller][params.action](params);
    socket.emit(eventSignature('read', cast), results);
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
