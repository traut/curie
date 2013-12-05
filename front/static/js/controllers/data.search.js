Curie.Controllers.Data.Search = function () {

    var SEARCH_FIELDS = ["subject", "from.name", "body"];

    var lastModel = null;

    var getResults = function(query64) {
        query = b64_to_utf8(query64);

        if (lastModel) {
            if (lastModel.get("query") == query) {
                return lastModel;
            } else {
                lastModel.destroy();
            }
        }

        console.info("getting results for '" + query + "'");
        lastModel = curie.cache.add(Curie.Models.SearchResults, {
            id : new jsSHA(query, "TEXT").getHash("SHA-512", "HEX"),
            query : query
        });
        return lastModel;
    }

    var createQueryFromTerm = function(term) {
        var extendedQuery = _.map(SEARCH_FIELDS, function(f) {
            return '' + f + ':"' + term + '"';
        }).join(" OR ");
        return "+(" + extendedQuery + ")";
    };

    var extendQuery = function(query) {
        if (query == null || query == '') {
            return '';
        };

        var _query;
        if (query[0] == "+") {
            _query = query.substring(1);
        } else {
            _query = createQueryFromTerm(query);
        }
        return _query;
    }


    var extendAndEncodeQuery = function(query) {
        return utf8_to_b64(extendQuery(query));
    }

    _.extend(this, {
        getResults : getResults,
        extendQuery : extendQuery,
        extendAndEncodeQuery : extendAndEncodeQuery
    });
}
