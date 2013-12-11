Curie.Controllers.Data.Packs = function () {

    var draftPack = curie.cache.add(Curie.Models.Pack, {id : "draft", name : "draft"});
    var inboxPack = curie.cache.add(Curie.Models.Pack, {id : "inbox", name : "inbox"});

    var packs = {
        dynamic : new Curie.Models.Packs([], { url : '/packs', }),
        predefined : new Curie.Models.UnsortedPacks([ inboxPack, draftPack ])
    }

    _.forEach(packs, function(packList, key) {
        curie.cache.addInstance(packList, key);
    });

    packs.predefined.fetch = function(options) {
        packs.predefined.map(function(p) {
        });
        if (options && options.success) {
            options.success();
        } else {
            dummy();
        }
    };


    var refetchPacks = function(callback, render) {

        var fetchingDone = _.after(_.keys(packs).length, function() {
            (callback || dummy)();
            curie.state.trigger("fetch:done");
        });

        _.each([packs.predefined, packs.dynamic], function(packList) {

            // we want to render packList in order, so can't put it in "success" func
            render && curie.controllers.layout.renderPackListView(packList);

            packList.fetch({
                success : function() {

                    packList.each(function(pack) {
                        curie.controllers.layout.createPackView(pack);
                        pack.fetchMessages();
                    });

                    fetchingDone();
                },
                error : function() {
                    console.error("Can't fetch", packList);
                }
            });
        });
    }


    curie.state.once("connection:initial", function() {
        refetchPacks(function() {

            Backbone.history.stop();
            Backbone.history.start();

        }, true);
    });

    curie.state.on("connection:established", refetchPacks);

    this.getPacks = function() {
        return [packs.predefined, packs.dynamic];
    }
}

