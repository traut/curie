var CHECK_ON_CHANGES_SEC = 3;

var DraftView = Backbone.View.extend({
    template : Handlebars.templates.draft,
    events : {
        "input form input,textarea" : "fieldChanged",
    },
    initialize : function() {

        this.currentInterval = setInterval(this.saveDraft.bind(this), CHECK_ON_CHANGES_SEC * 1000);

        stateModel.on("newDraft hideDraft", this.cleanUp, this);

        this.model.on("change:saved", this.updateSaved, this);

    },
    render : function() {
        console.info("rendering newMessage view");

        var html = this.template(this.model.toJSON());
        this.$el.append($(html));

        $("#packView").append(this.$el);
        $("input[name=to]", this.$el).focus();

        return this;
    },
    saveDraft : function() {

        if (this.model.get("saved")) {
            this.updateSaved(null, this.model.get("saved"));
        }

        if (!this.model.changedByUser) {
            console.info("The draft is untouched, nothing to save");
            return;
        }

        this.model.save();
        this.model.changedByUser = false;
        console.info(this.model);
    },
    fieldChanged : function(e) {
        var data = {};
        var field = e.currentTarget;
        data[field.name] = field.value;
        this.model.set(data);

        this.model.changedByUser = true;
    },
    updateSaved : function(m, value) {
        var savedBox = $(".savedValue", this.$el);
        savedBox.text(Handlebars.helpers.date_ago(value));
        savedBox.parent("div").show();
    },
    cleanUp : function() {
        console.info("Cleanup for draft [check for leaks]", this.model);
        this.close();
        clearInterval(this.currentInterval);
        stateModel.off("hideDraft newDraft", this.cleanUp, this);
    }
});


