
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
    template : Handlebars.templates.thread,
    el : '#packView #view', //$('<div id="message-' + this.model.id + '" class="row messageView"></div>');
    events : {
        "click button.close" : "closeAndNavigate",
    },
    initialize : function() {
        this.model.on("change", this.render, this);
        stateModel.on("escPressed", this.closeAndNavigate, this);
        stateModel.on("navigateToActivePack", this.close, this);

    },
    render : function(yOffset) {
        console.info("rendering thread=" + this.model.id);

        var data = this.model.toJSON();
        _.each(data.messages, prepareBodyBlocks)
        $(".content", this.$el).html(this.template(data));

        var self = this;
        setTimeout(function() {
            if (isElementInDOM(self.$el) && self.model.get("unread")) {
                //FIXME: this is causing 'change' event and render() again
                self.setUnreadTo(false);
            }
        }, 1000);

        var topOffset = yOffset || 15;
        this.$el.css("top", topOffset);

        return this;
    },
    closeAndNavigate : function() {
        stateModel.trigger("navigateToActivePack");
    },
    setUnreadTo : function(bool, successCallback, errorCallback) {
//        this.model.save({unread : bool}, {
//            patch : true,
//            success : successCallback || dummy,
//            error : errorCallback || dummy
//        });
    },
    hide : function() {
//        this.setToUnreadTrue = false;
        this.$el.hide();
    },
});
