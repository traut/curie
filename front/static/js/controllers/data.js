Curie.Controllers.Data = function () {

    var connection = new Curie.Controllers.Data.Connection();
    var packs = new Curie.Controllers.Data.Packs();
    var search = new Curie.Controllers.Data.Search();

    _.extend(this, {
        reconnect : connection.reconnect,
        auth : connection.auth,
        getSocket : connection.getSocket,
        getSearchResults : search.getResults,
        extendAndEncodeQuery : search.extendAndEncodeQuery
    });
}

