
function DraftController() {


    stateModel.on("showDraft", function(draftId) {

        console.info("showing draft");

        //stateModel.set("activePackName", "draft/" + (draftId || ""));

        var fromField = [{
            email : 't@curie.heyheylabs.com',
            name : 'Test Guy'
        }];

        var draftModel = (draftId) ? new Draft({ id : draftId }) : new Draft({ created : new Date(), from: fromField });

        var draftView = new DraftView({
            model : draftModel
        });

        draftModel.on("change:id", function(m, value) {
            if (value) {
                console.info("new draft id, navigating!");

                var activeName = stateModel.get("activePackName");
                window.curie.router.navigate(window.curie.router.reverse('showDraft', {pack : activeName, draftid : value}));

            }
        });

        var showDraft = function() {
            draftView.render();
            draftView.$el.show();
        }

        if (draftId) {
            draftModel.fetch({ success : showDraft });
        } else {
            showDraft();
        }
    }, this);

//    stateModel.on("change:activePackName", function(i, activePackName) {
//        if (activePackName && activePackName.indexOf("draft") == -1) {
//            console.info("triggering hideDraft!");
//            stateModel.trigger("hideDraft");
//        }
//    }, this);

}
