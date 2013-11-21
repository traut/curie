Curie.Controllers.Data.Search = function () {

    var SEARCH_FIELDS = ["subject", "from.name", "body"];

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

    var createQueryFromTerm = function(term) {
        var extendedQuery = _.map(SEARCH_FIELDS, function(f) {
            return '' + f + ':"' + term + '"';
        }).join(" OR ");
        return "+(" + extendedQuery + ")";
    };

    var extendAndEncodeQuery = function(query) {
        if (query == null || query == '') {
            return '';
        };

        var _query;

        if (query[0] == "+") {
            _query = query.substring(1);
        } else {
            _query = createQueryFromTerm(query);
        }
        return utf8_to_b64(_query);
    }

    _.extend(this, {
        getResults : getResults,
        extendAndEncodeQuery : extendAndEncodeQuery
    });
}
