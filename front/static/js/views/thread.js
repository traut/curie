
var ThreadRowView = Backbone.View.extend({
    template : Handlebars.templates.threadRow,
    initialize : function() {
        this.hashUrl = this.options.rootUrl + "/t/" + this.model.id;
        this.model.on("remove", this.remove, this);
        this.model.get("messages").on("change", this.render, this);

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
        this.$el = $(html);
        return this;
    },
    remove : function(m, collection, options) {
        this.close();
    },
});


var ThreadView = Backbone.View.extend({

    tagName : 'div',
    attributes : {
        'class' : 'threadView'
    },

    initialize : function() {
        this.model.on("change sort", this.render, this);
        this.model.get("messages").on("remove", this.render, this);

        console.info(this.model.get("messages"));

        this.subViews = [];
        this.draftView = null;
    },

    isDraftTheLastOne : function() {
        return this.model.get("messages").last().get("draft");
    },

    makePersistent : function(model, value) {
        this.model.set({ id : value }, {silent : true});
        this.model.trigger("change");

        var url = curie.router.reverse("showThread", {pack : curie.state.get("activePack").get("name"), thread : value});
        curie.router.navigate(url, {trigger: false});
        curie.cache.addInstance(model);
    },

    createViewForModel : function(message) {
        if (message instanceof Curie.Models.Draft) {
            return new DraftView({ model : message, embedded : true });
        } else if (message instanceof Curie.Models.Message) {
            return new MessageView({ model : message});
        } else {
            console.error("Unknown message type", message);
            return null;
        }
    },

    beforeClose : function() {
        _.each(this.subViews, function(v) {
            v.$el.remove();
            v.close();
        });

        this.draftView && this.draftView.close();

        this.$el.remove();
    },

    render : function() {

        _.each(this.subViews, function(v) {
            v.$el.remove();
            v.close();
        });

        var messages = this.model.get("messages");

        console.info("Thread, rendering", messages);

        this.subViews = messages.map(this.createViewForModel);

        console.info("Subviews:", this.subViews);

        if (messages.length > 0 && !this.isDraftTheLastOne()) {
            this.addDraftView();
        }

        _.each(this.subViews, function(v) {
            v.render();
            this.$el.append(v.$el);
        }, this);

        return this;
    },

    addDraftView : function() {

        if (this.draftView) {
            this.draftView.model.off(null, null, this);
            this.draftView.closeAndRemove();
        }

        this.subViews = _.without(this.subViews, this.draftView);

        this.draftView = this.createViewForModel(this.createDraftModel());

        this.subViews.push(this.draftView);

        this.draftView.render();
        this.$el.append(this.draftView.$el);

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
        return model;

    },

});
