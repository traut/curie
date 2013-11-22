var WrappedRowView = Backbone.View.extend({
    initialize : function(options) {
        if (this.model instanceof Curie.Models.Thread) {
            this.wrappedView = new ThreadRowView({ model : this.model, rootUrl : this.options.rootUrl });
        //} else if (this.model.get("labels") && this.model.get("labels").indexOf("draft") > -1) {
        } else if (this.model instanceof Curie.Models.Draft) {
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

        //this.model.on("change:unread", this.updateUnread, this);
        this.model.on("change", this.render, this);
        this.model.on("remove", this.removeMessage, this);

        this.hashUrl = this.options.rootUrl + "/" + this.model.id;
    },
    render : function() {
        //console.info("rendering messagerowview for " + this.model.get("id"));
        var data = this.model.toJSON();
        data.url = this.hashUrl;
        var html = this.template(data);
        this.$el.html(html);
        return this;
    },
    removeMessage : function(m, collection, options) {
        this.close();
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


var MessageView = Backbone.View.extend({
    template : Handlebars.templates.message,
    events : {
        "click a[name=showAsBodyType]" : "changeBodyType",
        "click a[name=deleteMessageForever]" : "deleteMessageForever",
    },
    initialize : function() {
        //this.model.on("change", this.render, this);
    },
    render : function() {
        console.info("rendering message " + this.model.id);

        var data = this.model.toJSON();
        prepareBodyBlocks(data, true);

        this.$el.html(this.template(data));

        var self = this;
        setTimeout(function() {
            if (isElementInDOM(self.$el) && self.model.get("unread")) {
                //FIXME: this is causing 'change' event and render() again
                self.setUnreadTo(false);
            }
        }, 1000);

        return this;
    },
    setUnreadTo : function(bool, successCallback, errorCallback) {
        this.model.save({unread : bool}, {
            patch : true,
            success : successCallback || dummy,
            error : errorCallback || dummy
        });
    },
    showBodyType : function(type) {
        _.each($("div.body", this.$el), function(b) {
            var body = $(b);
            if (body.data("type") == type) {
                body.show();
            } else {
                body.hide();
            }
        });
        if ($("div.body", this.$el).length == 1) {
            $("div.body", this.$el).show();
        }
    },
    deleteMessageForever : function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.model.destroy();
    },
    changeBodyTypeHotkey : function(value) {
        this.showBodyType(value);
    },
    changeBodyType : function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var target = $(e.target);
        target.parents(".btn-group").removeClass('open');

        this.showBodyType(target.data("type"));
    },
    beforeClose : function() {
        this.undelegateEvents();
    }
});

