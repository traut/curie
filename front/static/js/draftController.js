
function DraftController() {

    var draftModel = null;
    var draftView = null;

    stateModel.on("newDraft", function() {
        stateModel.set("activePackName", null);
    });

    stateModel.on("newDraft", function(draftId) {

        console.info("creating new draft view");

        if (draftId) {
            draftModel = new Draft({ id : draftId });
        } else {
            draftModel = new Draft({ created : new Date() });
        }
        draftView = new DraftView({
            model : draftModel
        });

        draftModel.on("change:id", function(m, value) {
            if (value) {
                window.curie.router.navigate("#new/" + value);
            }
        });

        $("#packView").append(draftView.render().$el);
        draftView.initialFocus();
    }, this);

    stateModel.on("change:activePackName", function(i, activePackName) {
        stateModel.trigger("hideDraft");
    }, this);

}
