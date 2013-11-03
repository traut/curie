
var ThreadRowView = Backbone.View.extend({
    template : Handlebars.templates.threadRow,
    initialize : function() {
        this.hashUrl = this.options.rootUrl + "/t/" + this.model.id;
        this.model.on("remove", this.remove, this);
    },
    render : function() {
        console.info("rendering row view id=" + this.model.get("id"));
        var data = this.model.toJSON();
        data.latest = this.model.getLatestMessage();
        data.url = this.hashUrl;
        var html = this.template(data);
        this.$el = $(html);
        return this;
    },
    remove : function(m, collection, options) {
        this.close();
    },
});


var ThreadView = Backbone.View.extend({
    initialize : function() {
        this.model.on("change", this.render, this);
    },
    render : function(yOffset) {
        console.info("rendering thread=" + this.model.id);

        var messageViews = _.map(this.model.get("messages"), function(message) {
            return new MessageView({ model : message });
        });

        this.$el = $("<div class='threadView'></div>");

        _.each(messageViews, function(v) {
            v.render();
            this.$el.append(v.$el);
        }, this);

        return this;
    },
});
