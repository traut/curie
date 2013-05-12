
var stateModel = new StateModel();

function Controller() {

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
        predefinedPacks.each(function(m) {
            m.fetch();
        });
        (options.success || dummy)();
        predefinedPacks.trigger("reset");
    };

    var packBlocks = [serverPacks, predefinedPacks];

    packBlocks.map(function(packs) {
        $("#packBlocks").append(new PackListView({ model : packs }).$el);
    });

    this.draftModel = null;
    this.draftView = null;
    stateModel.on("newDraft", function() {
        stateModel.set("activePackName", null);
        $("#newMessageLi").addClass("active");
    });
    stateModel.on("hideDraft", function() {
        $("#newMessageLi").removeClass("active");
    });
    stateModel.on("newDraft", function(draftId) {

        console.info("creating new draft view");

        var draft;
        if (draftId) {
            draft = new Draft({ id : draftId });
        } else {
            draft = new Draft({ created : new Date() });
        }
        this.draftModel = draft;
        this.draftView = new DraftView({
            model : this.draftModel
        });

        this.draftModel.on("change:id", function(m, value) {
            if (value) {
                window.curie.router.navigate("#new/" + value);
            }
        });

        $("#packView").html(this.draftView.render().$el);
        this.draftView.initialFocus();

    }, this);

    stateModel.on("change:activePackName", function(i, activePackName) {
        stateModel.trigger("hideDraft");
    }, this);

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

    this.fetchPacks = function(callback) {
        var packsFetched = _.after(packBlocks.length, function() {
            stateModel.trigger("fetchFinished");

            (callback || dummy)();
        });

        packBlocks.map(function(packs) {
            packs.fetch({
                success : function() {
                    packs.each(function(model) {
                        new PackView({ model : model }).model.fetchAll({update: true});
                    });
                    packsFetched();
                }
            });
        });
    }

}
