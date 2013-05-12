
var MessageView = Backbone.View.extend({
    tagName : 'div',
    template : Handlebars.templates.message,
    initialize : function() {
        this.model.on("change", this.render, this);
        this.model.fetch();
    },
    render : function(e) {
        console.info("rendering message " + this.model.id);

        var data = this.model.toJSON();

        //FIXME: create a separate formatter class
        data.body = _.map(data.body, function(b) {
            return b.replace(/\n{2}/g, "<br/>").replace(/\n/g, "<br/>");
        });

        this.$el.html(this.template(data));


        var markUnreadButton = $("button[name=markUnread]", this.$el);
        var self = this;
        markUnreadButton.click(function() {
            var markUnreadButton = $("button[name=markUnread]", self.$el);
            self.setToUnreadTrue = true;

            self.setUnreadTo(true, function() {
                console.info("unread update success");
            }, function() {
                console.info("unread update error");
            });
        });

        if (this.$el.is(":visible") && this.model.get("unread") && !this.setToUnreadTrue) {
            //FIXME: this is causing 'change' event and render() again
            setTimeout(function() {
                self.setUnreadTo(false);
            }, 100);
        };
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
    },
    render : function() {
        console.info("rendering messageRowView " + this.model.get("id"));
        var data = this.model.toJSON();

        if (!this.hashUrl) {
            this.hashUrl = window.curie.router.reverse("showMessage", {
                pack : this.options.pack,
                message : this.model.get("id")
            });
        }
        data.url = this.hashUrl;
        var html = this.template(data);
        this.$el = $(html);
        return this;
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
        //this.model.messages.bind("change:unread", this.updateBadge, this);
    },
    render : function() {
        console.info("rendering messageGroupView " + this.model.get("id"));

        if (!this.hashUrl) {
            this.hashUrl = window.curie.router.reverse("showGroup", {
                pack : this.options.pack,
                group : this.model.get("value")
            });
        }

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
    updateBadge : function(e) {
        var unreads = 2; //this.model.messages.getUnreadCount();
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
        //this.model.messages.bind("change:unread", this.updateBadge, this);
        this.messageRowViews = {};

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

        if (!this.hashUrl) {
            this.hashUrl = window.curie.router.reverse("showGroup", {
                pack : this.options.pack,
                group : this.model.get("value")
            });
        }

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
    updateBadge : function(e) {
        var unreads = 2; //this.model.messages.getUnreadCount();
        if (unreads > 0) {
            $("span[name=unread] span[name=value]", this.$el).text(unreads);
            $("span[name=unread]").show();
        } else {
            $("span[name=unread]").hide();
            $("span[name=unread] span[name=value]", this.$el).text('');
        }
    }
});
