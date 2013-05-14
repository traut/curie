
var MessageView = Backbone.View.extend({
    template : Handlebars.templates.message,
    events : {
        "click button.close" : "closeMessage",
    },
    initialize : function() {
        this.model.on("change", this.render, this);
        stateModel.on("escPressed", this.closeOnEsc, this);

        this.$el = $('<div id="message-' + this.model.id + '" class="row messageView"></div>');
    },
    render : function(yOffset) {
        console.info("rendering message " + this.model.id);

        var topOffset = yOffset || 15;

        var data = this.model.toJSON();

        //FIXME: create a separate formatter class
        data.body = _.map(data.body, function(b) {
            return b.replace(/\n{2}/g, "<br/>").replace(/\n/g, "<br/>");
        });

        this.$el.html(this.template(data));

        var self = this;
        setTimeout(function() {
            if (isElementInDOM(self.$el) && self.model.get("unread")) {
                //FIXME: this is causing 'change' event and render() again
                self.setUnreadTo(false);
            }
        }, 1000);

        this.$el.css("top", topOffset);

        return this;
    },
    closeMessage : function() {
        this.$el.remove();
        stateModel.trigger("navigateToActivePack");
    },
    closeOnEsc : function() {
        if (isElementInDOM(this.$el)) {
            this.closeMessage();
        }
    },
    setUnreadTo : function(bool, successCallback, errorCallback) {
        this.model.save({unread : bool}, {
            patch : true,
            success : successCallback || dummy,
            error : errorCallback || dummy
        });
    },
    hide : function() {
        this.setToUnreadTrue = false;
        this.$el.hide();
    },
    show : function() {
        console.info("Show called for message " + this.model.id);
        if (!jQuery.contains(document.documentElement, this.$el[0])) { // the element removed from DOM
            console.info("Message " + this.model.id + " is not in DOM. adding");
            $("#message-row-" + this.model.id).after(this.$el.hide());
        }
        this.$el.show();

    }
});

var MessageRowView = Backbone.View.extend({
    template : Handlebars.templates.messageRow,
    initialize : function() {

        stateModel.on("change:selectedMessage", this.updateSelected, this);
        stateModel.markedMessages.on("add", this.setMarked, this);
        stateModel.markedMessages.on("remove", this.unsetMarked, this);

        this.model.on("change:unread", this.updateUnread, this);
        this.model.on("remove", this.removeMessage, this);

        this.hashUrl = this.options.rootUrl + "/" + this.model.id;
    },
    render : function() {
        console.info("rendering messageRowView " + this.model.get("id"));

        var data = this.model.toJSON();
        data.url = this.hashUrl;
        var html = this.template(data);
        this.$el = $(html);
        return this;
    },
    removeMessage : function(m, collection, options) {
        this.$el.remove();

        stateModel.off("change:selectedMessage", this.updateSelected);
        stateModel.markedMessages.off("add", this.setMarked);
        stateModel.markedMessages.off("remove", this.unsetMarked);
    },
    updateUnread : function(m, value) {
        updateElementClass(this.$el, value, "unread");
    },
    updateSelected : function(i, mid) {
        if (mid != this.model.id) {
            updateElementClass(this.$el, false, "selected");
            return;
        }
        updateElementClass(this.$el, true, "selected");
        if (value && !elementInViewport(this.$el[0])) {
            $('html, body').animate({scrollTop : this.$el.offset().top - 200}, 10);
        }
    },
    setMarked : function(m, coll) {
        if (m == this.model) {
            updateElementClass(this.$el, true, "marked");
        }
    },
    unsetMarked : function(m, coll) {
        if (m == this.model) {
            updateElementClass(this.$el, false, "marked");
        }
    }
});


var MessageGroupView = Backbone.View.extend({
    template : Handlebars.templates.messageGroup,
    initialize : function() {
        this.model.on("change:unread", this.updateBadge, this);
        this.model.on("remove", this.removeGroup, this);

        var query = "+header_from_email_raw:" + this.model.get("value");
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
        this.$el.remove();
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

        var query = "+header_from_email_raw:" + this.model.get("value");
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
        this.$el.remove();
    },
});
