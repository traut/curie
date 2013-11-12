Curie.Controllers.Data.Search = function () {

    var lastModel = null;

    var getResults = function(query64) {
        query = b64_to_utf8(query64);

        if (lastModel && lastModel.get("query") == query) {
            return lastModel;
        }

        console.info("getting results for '" + query + "'");
        lastModel = new SearchResults({ query : query });
        return lastModel;
    }

    _.extend(this, {
        getResults : getResults
    });
}
