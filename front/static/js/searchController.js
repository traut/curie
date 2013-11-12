Curie.Controllers.Data.Search = function () {

    var view = null;

    var searchModel = null;
    var searchView = null;

    function createSearchPackView(searchModel) {
        var query = searchModel.get("query");
        return new PackView({
            model : searchModel,
            title : '<span class="muted">Search:</span> ' + query + '',
            rootUrl : 'search/' + utf8_to_b64(query)
        });
    }

    stateModel.on("searchRequest", function(query64) {

        query = b64_to_utf8(query64);

        if (!searchModel || query != searchModel.get("query")) {
            searchModel = new SearchResults({ query : query });
            //FIXME: memory and event leak
            searchView = createSearchPackView(searchModel);
            searchView.model.fetch({update: true});
        }
        stateModel.set("activePackName", searchModel.get("name"));
    }, this);

    stateModel.on("change:activePackName", function(i, activePackName) {
        if (searchModel && searchModel.get("name") != activePackName) {
            searchView && searchView.close();
        }
    }, this);
}
