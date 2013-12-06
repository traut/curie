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
        var val = this.wrappedView.render({
            selected : this.selected,
            marked : this.marked
        });
        this.$el = val.$el;
        return val;
    },
    isSelected : function() {
        return this.wrappedView.isSelected();
    },
    isMarked : function() {
        return this.wrappedView.isMarked();
    },
    select : function() {
        return this.wrappedView.select();
    },
    unselect : function() {
        return this.wrappedView.unselect();
    },
    actionOpen : function() {
        window.location.hash = this.wrappedView.hashUrl;
    },
    actionMark : function() {
        return this.wrappedView.toggleMark();
    },
    cleanMarkings : function() { 
        this.unselect();
    }
});

var MessageRowView = Backbone.View.extend({
    template : Handlebars.templates.messageRow,
    initialize : function() {

        this.template = this.options.template || this.template;

        this.model.on("change:unread change:to change:from change:subject change:received", this.render, this);
        this.model.on("remove", this.removeMessage, this);

        this.hashUrl = this.options.rootUrl + "/" + this.model.id;

        this.selected = false;
        this.marked = false;
    },
    render : function() {
        //console.info("rendering messagerowview for " + this.model.get("id"));
        var data = this.model.toJSON();
        _.extend(data, {
            url : this.hashUrl,
            selected : this.selected,
            marked : this.marked
        });
        var html = this.template(data);
        this.$el.html(html);
        return this;
    },
    removeMessage : function(m, collection, options) {
        this.close();
    },
    updateUnread : function(m, value) {
        updateElementClass(this.$(".messageRow"), value, "unread");
    },
    select : function() {
        this.selected = true;
        updateElementClass(this.$(".messageRow"), true, "selected");
        if (!elementInViewport(this.$el[0])) {
            $('html, body').animate({scrollTop : this.$el.offset().top - 200}, 10);
        }
    },
    unselect : function() {
        this.selected = false;
        return updateElementClass(this.$(".messageRow"), false, "selected");
    },
    isSelected : function() {
        return this.selected;
    },
    isMarked : function() {
        return this.marked;
    },
    toggleMark : function() {
        this.marked = !this.marked;
        return this.$(".messageRow").toggleClass("marked");
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
        var data = this.model.toJSON();
        prepareBodyBlocks(data, true);

        _.extend(data, {
            url : this.rootUrl + "/" + this.model.get("id")
        });

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
        _.each(this.$(".body"), function(b) {
            var body = $(b);
            if (body.data("type") == type) {
                body.show();
                if (type == 'html') {
                    loadAndShowHTML(body, this.$("pre"));
                }
            } else {
                body.hide();
            }
        });
        if (this.$(".body").length == 1) {
            this.$(".body").show();
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
    },
    select : function() {
        this.$(".message").addClass("selected");
    },
    unselect : function() {
        this.$(".message").removeClass("selected");
    }

});

