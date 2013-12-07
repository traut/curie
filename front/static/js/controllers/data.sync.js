Curie.Controllers.Data.Sync = function () {
    var SYNC_INTERVAL = 1000 * 1000; // 10 secs

    var timer = null;

    function startPeriodicSync() {
        console.info("Starting sync controller. interval=" + SYNC_INTERVAL / 1000 + "sec");
        timer && clearInterval(timer);
        setInterval(function() {
            syncPackLists();
            syncPacks();
            syncActiveSearches();
            updateFetchTime();
        }, SYNC_INTERVAL);
    };


    function syncPacks() {
        var packs = curie.cache.filterByType(Curie.Models.Pack);

        console.info("Syncing " + packs.length + " packs");

        packs.forEach(function(p) {
            p.fetchMessages();
        });
    }

    function syncPackLists() {
        var packLists = curie.cache.filterByType(Curie.Models.Packs);

        console.info("Syncing " + packLists.length + " packLists");

        packLists.forEach(function(p) {
            p.fetch();
        });
    }

    function syncActiveSearches() {
        var searches = curie.cache.filterByType(Curie.Models.SearchResults);

        console.info("Syncing " + searches.length + " searches");

        searches.forEach(function(s) {
            s.fetch();
        });
    }

    function updateFetchTime() {
        curie.state.trigger("fetch:done");
    }


    this.start = startPeriodicSync;
}

