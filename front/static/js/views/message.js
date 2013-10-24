
var MessageView = Backbone.View.extend({
    template : Handlebars.templates.message,
    el : '#packView #view', //$('<div id="message-' + this.model.id + '" class="row messageView"></div>');
    events : {
        "click button.close" : "closeAndNavigate",
    },
    initialize : function() {
        //this.model.on("change", this.render, this);
        stateModel.on("escPressed", this.closeAndNavigate, this);
        stateModel.on("navigateToActivePack", this.close, this);
    },
    render : function(yOffset) {
        console.info("rendering message " + this.model.id);

        var data = this.model.toJSON();
        prepareBodyBlocks(data);
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
        this.model.save({unread : bool}, {
            patch : true,
            success : successCallback || dummy,
            error : errorCallback || dummy
        });
    },
});

var WrappedRowView = Backbone.View.extend({
    initialize : function(options) {
        if (this.model.get("thread")) {
            this.wrappedView = new ThreadRowView({ model : this.model, rootUrl : this.options.rootUrl });
        } else if (this.model.get("labels") && this.model.get("labels").indexOf("draft") > -1) {
            this.wrappedView = new MessageRowView({ model : this.model, rootUrl : this.options.rootUrl + '/new' });
        } else {
            this.wrappedView = new MessageRowView({ model : this.model, rootUrl : this.options.rootUrl });
        }
        this.$el = null;
    },
    render : function() {
        var val = this.wrappedView.render();
        this.$el = val.$el;
        return val;
    },
});

var MessageRowView = Backbone.View.extend({
    template : Handlebars.templates.messageRow,
    initialize : function() {

        this.template = this.options.template || this.template;

        this.on("change:selected", this.updateSelected, this);
        this.on("change:marked", this.updateMarked, this);

        this.model.on("change:unread", this.updateUnread, this);
        this.model.on("remove", this.removeMessage, this);

        this.hashUrl = this.options.rootUrl + "/" + this.model.id;
    },
    render : function() {
        var data = this.model.toJSON();
        data.url = this.hashUrl;
        var html = this.template(data);
        this.$el = $(html);
        return this;
    },
    removeMessage : function(m, collection, options) {
        this.close();

        stateModel.off("change:selectedMessage", this.updateSelected, this);
        stateModel.markedMessages.off("add", this.setMarked, this);
        stateModel.markedMessages.off("remove", this.unsetMarked, this);
    },
    updateUnread : function(m, value) {
        updateElementClass(this.$el, value, "unread");
    },
    updateSelected : function(a, b) {
        console.info("update selected", a, b);
        return;
        if (nextIndex != null) {
            this.messages.where({selected : true}).forEach(function(m) {
                m.set('selected', false);
            });
            this.messages.at(nextIndex).set('selected', true);
        }
        if (mid != this.model.id) {
            updateElementClass(this.$el, false, "selected");
            return;
        }
        updateElementClass(this.$el, true, "selected");
        if (value && !elementInViewport(this.$el[0])) {
            $('html, body').animate({scrollTop : this.$el.offset().top - 200}, 10);
        }
    },
    updateMarked : function(m, coll) {
        console.info("update marked", a, b);
        //updateElementClass(this.$el, true, "marked");
        if (markIndex != null) {
            var model = this.messages.at(markIndex);
            model.set('marked', !model.get("marked"));
            console.info(this.messages.at(markIndex), model.get("marked"));
        }
    },
});


var MessageGroupView = Backbone.View.extend({
    template : Handlebars.templates.messageGroup,
    initialize : function() {
        this.model.on("change:unread", this.updateBadge, this);
        this.model.on("remove", this.removeGroup, this);

        var query = "+from.email:" + this.model.get("value");
        this.hashUrl = window.curie.router.reverse("search", {
            encodedquery : btoa(query)
        });
    },
    render : function() {
        console.info("rendering messageGroupView " + this.model.get("id"));

        var html = this.template({
            id : this.model.id,
            name : this.model.get('value'),
            size : this.model.get('size'),
            unread : this.model.get("unread"),
            url : this.hashUrl,
        });
        this.$el = $(html);
        return this;
    },
    removeGroup : function(m, collection, options) {
        this.close();
    },
    updateBadge : function(m, unreads) {
        if (unreads > 0) {
            $("span[name=unread] span[name=value]", this.$el).text(unreads);
            $("span[name=unread]").show();
        } else {
            $("span[name=unread]").hide();
            $("span[name=unread] span[name=value]", this.$el).text('');
        }
    }
});

var MessageGroupListView = Backbone.View.extend({
    template : Handlebars.templates.messageGroupList,
    initialize : function() {
        this.messageRowViews = {};

        this.model.on("change:unread", this.updateBadge, this);
        this.model.on("remove", this.removeGroup, this);

        var query = "+from.email:" + this.model.get("value");
        this.hashUrl = window.curie.router.reverse("search", {
            encodedquery : btoa(query)
        });

        //FIXME: should reuse MessageRowView if only 1 message in a group
//            if (model.get("size") < 2 && style.viewClass == MessageGroupListView) {
//                style.views[model.id] = new MessageRowView({
//                    model : model.get("messages").at(0),
//                    pack : this.model.get('name'),
//                });
//            } else {

    },
    render : function() {
        console.info("rendering messageGroupView " + this.model.get("id"));

        var html = this.template({
            id : this.model.id,
            name : this.model.get('value'),
            size : this.model.get('size'),
            unread : this.model.get('unread'),
            url : this.hashUrl,
            messages : this.model.get("messages").toJSON(),
            thereIsMore : this.model.get("size") > this.model.get("messages").length
        });
        this.$el = $(html);

        var messagesListDiv = $(".messageList", this.$el);

        return this;
    },
    updateBadge : function(m, unreads) {
        if (unreads > 0) {
            $("span[name=unread] span[name=value]", this.$el).text(unreads);
            $("span[name=unread]").show();
        } else {
            $("span[name=unread]").hide();
            $("span[name=unread] span[name=value]", this.$el).text('');
        }
    },
    removeGroup : function(m, collection, options) {
        this.close();
    },
});
