
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
        this.marked = !this.marked;
        return this.$(">.messageRow").toggleClass("marked");
    },
});


var ThreadView = Backbone.View.extend({

    tagName : 'div',

    attributes : {
        'class' : 'threadView'
    },

    initialize : function() {

        this.model.get("messages").on("sort add remove", this.render, this);
        this.model.get("messages").on("sent", this.rerenderDraft, this);

        this.on("move", this.moveSelection, this);
        this.on("action", this.performAction, this);

        this.subViews = {};
        this.draftView = null;

        this.$messages = $("<div></div>");
        this.$draft = $("<div></div>");

        this.$el.append(this.$messages);
        this.$el.append(this.$draft);

        this.selectedIndex = 0;
    },

    isDraftTheLastOne : function() {
        return this.model.get("messages").last().get("draft");
    },

    showBodyType : function(type) {
        _.values(this.subViews).forEach(function(v) {
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
        if (message instanceof Curie.Models.Draft && !message.get("sent")) {
            return new Curie.Views.DraftView({ model : message, embedded : true });
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

        if (messages.length == 0) {
            console.warn("trying to render empty thread view");
            Mousetrap.trigger("esc");
            return;
        }

        _.forEach(this.subViews, function(v, key) {
            if (!messages.contains(v.model)) {
                console.info("Removing view for " + key, v, v.model);
                v.$el.remove();
                v.close();
                delete this.subViews[key];
            }
        }, this);

        messages.forEach(function(m) {
            if (!this.subViews[m.id] && !m.get("draft")) {
                this.renderViewForMessage(m);
            } else if (m.get("draft") && !this.draftView) {
                this.renderDraftView(m);
            }
        }, this);

        if (this.draftView == null && !this.isDraftTheLastOne()) {
            this.renderDraftView();
        }

        return this;
    },

    renderViewForMessage : function(m) {
        var v = this.createViewForModel(m);
        this.subViews[m.id] = v;

        v.render();
        this.$messages.append(v.$el);
    },

    closeDraftView : function() {
        if (this.draftView) {
            this.draftView.model.off(null, null, this);
            this.draftView.closeAndRemove();
            this.draftView = null;
        }
    },

    renderDraftView : function(model) {

        this.closeDraftView();

        var model = model || this.createDraftModel();

        this.draftView = this.createViewForModel(model);
        this.draftView.render();

        this.$draft.html(this.draftView.$el);
    },

    rerenderDraft : function(model) {
        console.info("'sent' event cached in thread. Rerendering draft " + model.id);

        var messages = this.model.get("messages");

        if (!messages.contains(model)) {
            this.model.fetch();
        } else {
            this.renderViewForMessage(model);
        }

        this.renderDraftView();
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
        model.on("sent", this.rerenderDraft, this);
        return model;

    },

    moveSelection : function(move) {
        var messages = this.model.get("messages");

        var views = messages.map(function(m) {
            return this.subViews[m.id];
        }, this);

        if (this.selectedIndex >= views.length) {
            this.selectedIndex = views.length - 1;
        }

        views[this.selectedIndex].unselect();

        this.selectedIndex = getNextIndex(this.selectedIndex, move, views.length);

        var view = views[this.selectedIndex];
        view.select();
        if (!elementInViewport(view.$el[0])) {
            $('html, body').animate({scrollTop : view.$el.offset().top - 200}, 10);
        }

    },
    performAction : function(action) {

        var messages = this.model.get("messages");

        if (action == "delete forever") {
            var toDelete = messages.filter(function(m) {
                console.info("isMarked ", m, m.id, this.subViews);
                return this.subViews[m.id].isMarked();
            }, this);

            if (confirm('Do you really want to delete forever ' + toDelete.length + ' messages?')) {
                toDelete.map(function(m) {
                    m.destroy();
                });
            }
        } else {
            var selected = messages.find(function(m) {
                return this.subViews[m.id].isSelected();
            }, this);

            if (!selected) {
                console.info("Nothing is selected, can't do '" + action + "'");
                return;
            }
            if (action == 'mark') {
                this.subViews[selected.id].actionMark();
            }
        }
    }
});
