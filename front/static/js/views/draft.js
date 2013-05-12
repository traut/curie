var DraftView = Backbone.View.extend({
    template : Handlebars.templates.draft,
    initialize : function() {
        stateModel.on("hideDraft", function() {
            this.$el.remove();
        }, this);
    },
    render : function() {
        console.info("rendering newMessage view");
        var html = this.template(this.model.toJSON());
        this.$el = $(html);
        return this;
    },
    initialFocus : function() {
        $("input[name=to]", this.$el).focus();
    }
});


