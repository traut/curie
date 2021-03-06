Curie.Controllers.Data = function () {

    var connection = new Curie.Controllers.Data.Connection();
    var packs = new Curie.Controllers.Data.Packs();
    var search = new Curie.Controllers.Data.Search();
    var sync = new Curie.Controllers.Data.Sync();

    _.extend(this, {
        getPacks : packs.getPacks,
        archiveMessages : packs.archiveMessages,

        reconnect : connection.reconnect,
        auth : connection.auth,
        getSocket : connection.getSocket,

        getSearchResults : search.getResults,
        extendQuery : search.extendQuery,
        extendAndEncodeQuery : search.extendAndEncodeQuery,

        deleteAllFound : search.deleteAllFound,

        startSync : sync.start,
        stopSync : sync.stop,
    });
}

