
function DraftController() {


    stateModel.on("newDraft", function(draftId) {

        stateModel.set("activePackName", "draft/" + (draftId || ""));

        console.info("creating new draft view");

        var draftModel = (draftId) ? new Draft({ id : draftId }) : new Draft({ created : new Date() });

        var draftView = new DraftView({
            model : draftModel
        });

        draftModel.on("change:id", function(m, value) {
            if (value) {
                console.info("new draft id, navigating!");
                window.curie.router.navigate("#new/" + value);
                stateModel.set("activePackName", "draft/" + value);
            }
        });

        draftView.render();

    }, this);

    stateModel.on("change:activePackName", function(i, activePackName) {
        if (activePackName && activePackName.indexOf("draft") == -1) {
            console.info("triggering hideDraft!");
            stateModel.trigger("hideDraft");
        }
    }, this);

}
