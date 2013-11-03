
/*
 * properties
 *      activePackName
 *      activeArrowsListener
 *
 *      selectedPackName #FIXME: needs refactoring to a global listener
 *
 * events
 *      navigateToActivePack
 *      showMessage (messageId)
 *      showThread (threadId)
 *      showDraft (draftId)
 *
 *      searchRequest (query64)
 *
 *
 */
var stateModel = new StateModel();

function Controller() {

    var draftController = new DraftController();
    var searchController = new SearchController();

    var loginPopup = LoginModal().create();

    // models
    var serverPacks = new Packs([], {
        url : '/packs',
    });
    var predefinedPacks = new Packs([
        {name : "draft"},
    ], {
        urlRoot : '/packs',
    });

    predefinedPacks.fetch = function(options) {
        (options.success || dummy)();
    };

    var packBlocks = [serverPacks, predefinedPacks];

    packBlocks.map(function(packs) {
        $("#packBlocks").append(new PackListView({ model : packs }).$el);
    });


    stateModel.on("selectPack", function(movement) {

        var selectedName = stateModel.get("selectedPackName");

        var flatPacks = [];
        packBlocks.map(function(packs) {
            packs.models.map(function(p) {
                flatPacks.push(p);
            });
        });

        var currentIndex;
        if (selectedName) {
            currentIndex = flatPacks.indexOf(_.find(flatPacks, function(m) {
                return m.get("name") == selectedName;
            }));
        } else {
            currentIndex = 0;
        }

        var nextIndex = null;
        if (movement == "below") {
            nextIndex = (currentIndex == null) ? 0 : ((currentIndex + 1) % flatPacks.length); // change to 0 (if null) if "change active on move" is disabled
        } else if (movement == "above") {
            nextIndex = ((currentIndex) ? currentIndex : flatPacks.length) - 1;
        }
        console.info(currentIndex, nextIndex, flatPacks);
        stateModel.set("selectedPackName", flatPacks[nextIndex].get("name"));

        console.info(flatPacks[nextIndex].get("name"));

        // try if it makes sense to active pack on the move event
        stateModel.trigger("activateSelectedPack");
    }, this);

    stateModel.on("activateSelectedPack", function() {
        var selectedName = stateModel.get("selectedPackName");
        console.info("activateSelectedPack event catched, name=" + selectedName);
        if (selectedName) {
            stateModel.set("activePackName", selectedName);
        }
    }, this);

    stateModel.on("navigateToActivePack", function() {
        var activeName = stateModel.get("activePackName");
        //FIXME: come up with a better solution
        if (activeName.indexOf("search/") == 0) {
            var query = activeName.split("search/")[1];
            window.curie.router.navigate(
                window.curie.router.reverse('search', {encodedquery : query}),
                {trigger : true}
            );
        } else {
            console.info("navigating to " + activeName);
            window.curie.router.navigate(
                window.curie.router.reverse('showPack', {pack : activeName}),
                {trigger : true}
            );
        }
    }, this);

    var popupView = new PopupView();

    stateModel.on("showMessage", function(messageId) {
        var message = new Message({ id : messageId });
        message.fetch({
            success : function() {
                popupView.render(new MessageView({ model : message }));
            }
        });
    }, this);

    stateModel.on("showThread", function(threadId) {
        var thread = new Thread({ id : threadId });
        thread.fetch({
            success : function() {
                popupView.render(new ThreadView({ model : thread }));
            }
        });
    }, this);

    stateModel.on("logout", function() {
        delCookie("curie.channel");
        window.location = "/logout";
    });

    new AppView();

    this.refetch = function(callback) {
        var packsFetched = _.after(packBlocks.length, function() {
            stateModel.trigger("fetchFinished");
            (callback || dummy)();
        });

        packBlocks.map(function(packs) {
            console.info("123", packs);
            packs.fetch({
                success : function() {
                    packs.each(function(model) {
                        model.fetchAll({update: true});
                    });
                    packsFetched();
                }
            });
        });
    }

    this.firstFetch = function(callback) {
        var packsFetched = _.after(packBlocks.length, function() {
            console.info("Fetch for all packs is finished!");
            stateModel.trigger("fetchFinished");
            (callback || dummy)();
        });

        console.info(packBlocks.length);

        packBlocks.map(function(packs) {
            packs.trigger("reset");
            packs.fetch({
                error : function() {
                    console.info("Can't fetch packs for:", packs);
                },
                success : function() {
                    console.info("Packs list fetched!");
                    packs.each(function(model) {
                        new PackView({ model : model });
                        model.fetchAll({ update: true });
                    });
                    packsFetched();
                }
            });
        });

    }

    this.routeToNew = function() {
        var pack = stateModel.get("activePackName");

        if (pack == null || pack == undefined) {
            pack = "inbox";
        }

        //FIXME: come up with a better solution
        if (pack.indexOf("search/") == 0) {
            var query = pack.split("search/")[1];
            window.curie.router.navigate(
                window.curie.router.reverse('showSearchDraft', {encodedquery : query, draftid : ''}),
                {trigger : true}
            );
        } else {
            window.curie.router.navigate(
                window.curie.router.reverse('showDraft', {pack : pack, draftid : ''}),
                {trigger : true}
            );
        }

        console.info("navigating to new in pack " + pack);
    }

}
