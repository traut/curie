
var ThreadRowView = Backbone.View.extend({
    template : Handlebars.templates.threadRow,
    initialize : function() {
        this.hashUrl = this.options.rootUrl + "/t/" + this.model.id;
        this.model.on("remove", this.remove, this);
        this.model.on("change:last", this.render, this);

        this.selected = false;
        this.marked = false;

    },
    render : function() {

        console.info("rendering thread row view id=" + this.model.get("id") + ", length=" + this.model.get("length"));

        //FIXME: ugly, should be changed
        var template, modelData;
        if (this.model.get("length") < 2) {
            template = Handlebars.templates.messageRow;
            modelData = this.model.get("last");
        } else {
            template = Handlebars.templates.threadRow;
            modelData = this.model.toJSON();
        }
        var data = _.extend(modelData, {
            url : this.hashUrl,
        });
        var html = template(data);
        this.$el.html(html);
        return this;
    },
    remove : function(m, collection, options) {
        this.close();
    },
    select : function() {
        this.selected = true;
        updateElementClass(this.$(">.messageRow"), true, "selected");
        if (!elementInViewport(this.$el[0])) {
            $('html, body').animate({scrollTop : this.$el.offset().top - 200}, 10);
        }
    },
    unselect : function() {
        this.selected = false;
        return updateElementClass(this.$(">.messageRow"), false, "selected");
    },
    isSelected : function() {
        return this.selected;
    },
    isMarked : function() {
        return this.marked;
    },
    toggleMark : function() {
        return this.$(">.messageRow").toggleClass("marked");
    },
});


var ThreadView = Backbone.View.extend({

    tagName : 'div',
    attributes : {
        'class' : 'threadView'
    },

    initialize : function() {

        this.model.get("messages").on("sort add remove sent", this.render, this);

        this.on("move", this.moveSelection, this);
        this.on("action", this.performAction, this);

        this.subViews = {};
        this.draftView = null;

        this.selectedIndex = 0;
    },

    isDraftTheLastOne : function() {
        return this.model.get("messages").last().get("draft");
    },

    showBodyType : function(type) {
        _.values(this.subViews, function(v) {
            v.showBodyType && v.showBodyType(type);
        });
    },

    makePersistent : function(model, value) {
        this.model.set({ id : value }, {silent : true});

        var url = curie.router.reverse("showThread", {pack : curie.state.get("activePack").get("name"), thread : value});
        curie.router.navigate(url, {trigger: false});
        curie.cache.addInstance(model);
    },

    createViewForModel : function(message) {
        if (message instanceof Curie.Models.Draft) {
            return new DraftView({ model : message, embedded : true });
        } else if (message instanceof Curie.Models.Message) {
            return new MessageView({ model : message });
        } else {
            console.error("Unknown message type", message);
            return null;
        }
    },

    beforeClose : function() {
        _.values(this.subViews, function(v) {
            v.$el.remove();
            v.close();
        });

        this.$el.remove();

        this.model.get("messages").off(null, null, this);
        this.off(null, null, this);
    },

    render : function() {

        var messages = this.model.get("messages");

        console.info(messages);

        _.forEach(this.subViews, function(v, key) {
            if (key == null || !messages.contains(v.model)) {
                v.$el.remove();
                v.close();
            }
        });

        if (messages.length == 0) {
            console.warn("trying to render empty thread view");
            Mousetrap.trigger("esc");
        }

        messages.forEach(function(m) {
            if (!this.subViews[m.cid]) {
                var v = this.createViewForModel(m);
                this.subViews[m.cid] = v;

                v.render();
                this.$el.append(v.$el);
            }
        }, this);

        if (messages.length > 0 && !this.isDraftTheLastOne()) {
            this.addDraftView();
        }

        return this;
    },

    addDraftView : function() {

        if (this.draftView) {
            this.draftView.model.off(null, null, this);
            this.draftView.closeAndRemove();
        }

        this.subViews = _.omit(this.subViews, [null]);

        this.draftView = this.createViewForModel(this.createDraftModel());

        this.subViews[null] = this.draftView;

        this.draftView.render();
        this.$el.append(this.draftView.$el);

    },

    fetchAndRender : function() {
        console.info("'sent' event cached in thread. Fetching and rendering");
        this.model.fetch();
    },

    createDraftModel : function() {

        var model = Curie.Models.Draft.prototype.newInstance({});

        var notFromMe = this.model.get("messages").filter(function(m) {
            return m.get("from").email != curie.state.account.get("primary").email;
        });

        var lastNotMyMessage = (notFromMe.length > 0) ? notFromMe[notFromMe.length - 1] : this.model.get("messages").last();

        console.info("lastNotMyMessage", lastNotMyMessage);

        model.inReplyTo(lastNotMyMessage);
        model.on("destroy", function() {
            this.addDraftView();
        }, this);
        model.on("change:currentThread", this.makePersistent, this);
        model.on("sent", this.fetchAndRender, this);
        return model;

    },

    moveSelection : function(move) {
        var messages = this.model.get("messages");

        var views = messages.map(function(m) {
            return this.subViews[m.cid];
        }, this);
        views.push(this.subViews[null]);

        views[this.selectedIndex].unselect();

        this.selectedIndex = getNextIndex(this.selectedIndex, move, views.length);

        var view = views[this.selectedIndex];
        view.select();
        if (!elementInViewport(view.$el[0])) {
            $('html, body').animate({scrollTop : view.$el.offset().top - 200}, 10);
        }

    },
    performAction : function(action) {
    }
});
