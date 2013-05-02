var DraftView = Backbone.View.extend({
    template : Handlebars.templates.draft,
    initialize : function() {
    },
    render : function() {
        console.info("rendering newMessage view");
        var html = this.template(this.model.toJSON());
        this.$el = $(html);
        return this;
    },
});

