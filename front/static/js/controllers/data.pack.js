Curie.Controllers.Data.Packs = function () {

    var draftPack = curie.cache.add(Curie.Models.Pack, {id : "draft", name : "draft"});

    var packs = {
        dynamic : new Curie.Models.Packs([], { url : '/packs', }),
        predefined : new Curie.Models.Packs([ draftPack ], { urlRoot : '/packs'})
    }

    _.forEach(packs, function(packList, key) {
        curie.cache.addInstance(packList, key);
    });

    packs.predefined.fetch = function(options) {
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

        _.each(packs, function(packList) {

            // we want to render packList in order, so can't put it in "success" func
            render && curie.controllers.layout.renderPackListView(packList);

            packList.fetch({
                success : function() {

                    packList.each(function(pack) {
                        curie.controllers.layout.createPackView(pack);
                        pack.fetchMessages({ update: true });
                    });

                    fetchingDone();
                },
                error : function() {
                    console.error("Can't fetch", packList);
                }
            });
        });
    }

    curie.state.on("hotkey:packList", function(movement) {

        var activePack = curie.state.get("activePack");

        var packModels = _.flatten(_.pluck(packs, "models"));

        var currentIndex = (activePack) ? packModels.indexOf(activePack) : -1;

        var nextIndex = null;
        if (movement == "up") {
            nextIndex = ((currentIndex > 0) ? currentIndex : packModels.length) - 1;
        } else if (movement == "down") {
            nextIndex = (currentIndex + 1) % packModels.length;
        } else {
            console.error("unknown hotkey type: " + movement);
            return;
        }

        curie.router.navigateToPack(packModels[nextIndex]);

    }, this);


    curie.state.once("connection:initial", function() {
        refetchPacks(function() {

            Backbone.history.stop();
            Backbone.history.start();

        }, true);
    });

    curie.state.on("connection:established", refetchPacks);
}

