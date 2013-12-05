var barista = require('barista'),
    isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs'),
    async = require('async'),

    settings = require('./settings'),
    utils = require('./utils');

var log = utils.getLogger("store");

// stores
accountStore = require('./substores/account');
packStore = require('./substores/pack');
messageStore = require('./substores/message');
draftStore = require('./substores/draft');
searchStore = require('./substores/search');
threadStore = require('./substores/thread');



var router = new barista.Router();

router.match('/account', 'GET').to('accountStore.getAccountDetails');
router.match('/filters/:id', 'DELETE').to('accountStore.deleteFilter');
router.match('/filters/:id', 'POST').to('accountStore.rerunFilter');
router.match('/filters', 'GET').to('accountStore.getFilters');
router.match('/filters', 'PUT').to('accountStore.addFilter');

router.match('/packs', 'GET').to('packStore.getPacks');
router.match('/packs/:pack', 'GET').to('packStore.getPack');
router.match('/packs/:pack/messages', 'GET').to('packStore.getMessagePreviews');
router.match('/packs/:pack/groups/:groupField', 'GET').to('packStore.getGroups');

router.match('/contacts/:groupField', 'GET').to('packStore.getGroups');

router.match('/threads/:threadId', 'GET').to('threadStore.getThread');

router.match('/messages/:messageId', 'GET').to('messageStore.getMessage');
router.match('/messages/:messageId', 'PATCH').to('messageStore.patchMessage');
router.match('/messages/:messageId', 'DELETE').to('messageStore.deleteMessageForever');

router.match('/search', 'GET').to('searchStore.getSearch');
router.match('/search/top', 'GET').to('searchStore.getTopNResults');

router.match('/drafts/:draftId', 'GET').to('draftStore.getDraft');
router.match('/drafts/:draftId', 'POST').to('draftStore.updateDraft');
router.match('/drafts/:draftId', 'DELETE').to('draftStore.deleteDraft');
router.match('/drafts', 'PUT').to('draftStore.updateDraft');


var stores = {
    accountStore : accountStore.AccountStore(),
    packStore : packStore.PackStore(),
    messageStore : messageStore.MessageStore(),
    threadStore : threadStore.ThreadStore(),

    draftStore : draftStore.DraftStore(),
    searchStore : searchStore.SearchStore()
}

var routeCall = function(handshake, cast, item, method, callback) {
    if (!cast.url) {
        callback("Badly formed request. No url parameter", null);
        return;
    }
    var params = router.first(cast.url, method);
    if (!params) {
        callback("Can't parse url='" + cast.url + "', method='" + method + "'", null);
        return;
    }
    log.info("routing call", cast, params);
    params.ctx = cast.ctx;
    params.item = item;
    stores[params.controller][params.action](handshake, params, callback);
}

var create = function (socket, cast, item) {
    routeCall(socket.handshake, cast, item, "PUT", function(err, results) {
        var signature = utils.eventSignature('create', cast);
        if (err) {
            log.error("create", err, {});
            socket.emit(signature, {error : err});
            return
        }
        socket.emit(signature, {success : true, response : results});
    });
};
 
var read = function (socket, cast) {
    routeCall(socket.handshake, cast, null, "GET", function(err, results) {
        var signature = utils.eventSignature('read', cast);
        if (err) {
            log.error("read", err);
            socket.emit(signature, {error : err});
            return
        }
        socket.emit(signature, {success : true, response : results});
    });
};
 
var update = function (socket, cast, item) {
    routeCall(socket.handshake, cast, item, "POST", function(err, results) {
        var signature = utils.eventSignature('update', cast);
        if (err) {
            log.error("update", err);
            socket.emit(signature, {error : err});
            return
        }
        socket.emit(signature, {success : true, response : results});
    });
};

var patch = function (socket, cast, changed) {
    routeCall(socket.handshake, cast, changed, "PATCH", function(err, results) {
        var signature = utils.eventSignature('patch', cast);
        if (err) {
            log.error("patch", err);
            socket.emit(signature, {error : err});
            return
        }
        socket.emit(signature, {success : true, response : results});
    });
};
 
var destroy = function (socket, cast, item) {
    routeCall(socket.handshake, cast, item, "DELETE", function(err, results) {
        var signature = utils.eventSignature('delete', cast);
        if (err) {
            log.error("delete", err);
            socket.emit(signature, {error : err});
            return
        }
        socket.emit(signature, {success : true, response : results});
    });
};

module.exports = {
    create : create,
    read : read,
    update : update,
    destroy : destroy,
    patch : patch
}
