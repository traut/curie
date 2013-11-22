Curie.Controllers.Data.Sync = function () {
    var SYNC_TIMEOUT = 5 * 1000; // 5 secs


    function startPeriodicSync() {
    }


    function syncPacks() {
        var packs = curie.cache.filterByType(Curie.Models.Pack);

        console.info("Syncing " + packs.length + " packs");

        packs.forEach(function(p) {
            p.fetchMessages({ update: true });
        });
    }

    function syncPackLists() {
        var packLists = curie.cache.filterByType(Curie.Models.PackList);

        console.info("Syncing " + packLists.length + " packLists");

        packLists.forEach(function(p) {
            p.fetch();
        });
    }

    function syncActiveSearches() {
        var searches = curie.cache.filterByType(Curie.Models.SearchResults);

        console.info("Syncing " + packLists.length + " packLists");

        packLists.forEach(function(p) {
            p.fetch();
        });
    }

    function updateFetchTime() {
        curie.state.trigger("fetch:done");
    }



    this.start = startPeriodicSync;
}

