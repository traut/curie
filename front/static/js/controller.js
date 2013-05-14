
var stateModel = new StateModel();

function Controller() {

    var draftController = new DraftController();
    var searchController = new SearchController();

    var loginPopup = LoginModal().create();

    //example
    var storedSearches = new Searches([
        { query : "+unread:true",},
        { query : "+received:[NOW/DAY TO NOW/DAY+1DAY]",},
    ]);


    // models
    var serverPacks = new Packs([], {
        url : '/packs',
    });
    var predefinedPacks = new Packs([
        {name : "sent"},
        {name : "drafts"},
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
            currentIndex = null;
        }

        var nextIndex = null;
        if (movement == "below") {
            nextIndex = (currentIndex == null) ? 1 : ((currentIndex + 1) % flatPacks.length); // change to 0 (if null) if "change active on move" is disabled
        } else if (movement == "above") {
            nextIndex = ((currentIndex) ? currentIndex : flatPacks.length) - 1;
        }
        stateModel.set("selectedPackName", flatPacks[nextIndex].get("name"));

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
        //FIXME: come up with the better solution
        if (activeName.indexOf("search/") == 0) {
            var query = activeName.split("search/")[1];
            window.curie.router.navigate(
                window.curie.router.reverse('search', {encodedquery : query}),
                {trigger : true}
            );
        } else {
            window.curie.router.navigate(
                window.curie.router.reverse('showPack', {pack : activeName}),
                {trigger : true}
            );
        }
    }, this);


    stateModel.on("showMessage", function(messageId) {
        var message = new Message({
            id : messageId
        });

        message.fetch({
            success : function() {
                var view = new MessageView({
                    model : message
                });
                $("#messageViews").html(view.render(window.pageYOffset).$el);
            }
        });

    }, this);

    stateModel.on("login", function(email, channel) {
        loginPopup.hide();

        setCookie("curie.stream", channel);
        setCookie("curie.account", email);
    });

    stateModel.on("logout", function() {

        delCookie("curie.session");
        delCookie("curie.stream");
        delCookie("curie.account");

        window.curie.socket && window.curie.socket.disconnect();
        window.curie.router.navigate("#");

        //FIXME: add all entities to entityMap and delete them there
        serverPacks.models.map(function(pack) {
            pack.messages.remove(pack.messages.models)
            pack.groups.remove(pack.groups.models)
        });
        serverPacks.remove(serverPacks.models);

        loginPopup.show();
    });

    new AppView();

    this.refetch = function(callback) {
        var packsFetched = _.after(packBlocks.length, function() {
            stateModel.trigger("fetchFinished");
            (callback || dummy)();
        });

        packBlocks.map(function(packs) {
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
            stateModel.trigger("fetchFinished");
            (callback || dummy)();
        });

        packBlocks.map(function(packs) {
            packs.trigger("reset");
            packs.fetch({
                success : function() {
                    packs.each(function(model) {
                        new PackView({ model : model });
                        model.fetchAll({ update: true });
                    });
                    packsFetched();
                }
            });
        });
    }

}
