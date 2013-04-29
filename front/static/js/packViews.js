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
                group : this.model.id
            });
        }

        var html = this.template({
            id : this.model.id,
            name : this.model.get('value'),
            unread : 2, //this.model.messages.getUnreadCount(),
            size : this.model.get('size'),
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
    },
    render : function() {
        console.info("rendering messageGroupView " + this.model.get("id"));

        if (!this.hashUrl) {
            this.hashUrl = window.curie.router.reverse("showGroup", {
                pack : this.options.pack,
                group : this.model.id
            });
        }

        var html = this.template({
            id : this.model.id,
            name : this.model.get('value'),
            unread : 2, //this.model.messages.getUnreadCount(),
            size : this.model.get('size'),
            url : this.hashUrl,
            messages : this.model.get('topMessages')
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

var PackGroupedView = Backbone.View.extend({
    el : "#packView",

    initialize : function() {

        this.model.on("render", this.render, this);

        //this.model.groups.on("reset", this.render, this);
        //this.model.groups.on("add", this.addGroup, this);
        //this.model.groups.on("remove", this.removeGroup, this);

        this.groupViews = {};
        this.groupViewClass = this.options.groupViewClass || MessageListGroupView;

        this.$packGroups = $('<div id="pack-groups" class="packGroups">');
    },

    prepareNewModel : function(model, collection) {

        collection = collection || this.model.groups;

        var modelsWithoutViews = _.filter(collection.models, function(model) {
            return !this.groupViews[model.id];
        }, this);

        _.each(modelsWithoutViews, function(model) {
            console.info("Looking at", model);
            this.groupViews[model.id] = new this.groupViewClass({
                model : model,
                pack : this.model.get('name')
            });
            console.info("View added for " + model.id, this.groupViews[model.id]);
        }, this);

        return this.groupViews[model.id];
    },

    addGroup : function(model, collection) {
        console.info("adding group", model);
        this.prepareNewModel(model);
        this.render();
    },

    removeGroup : function(model, collection, options) {
        var deletedView = this.groupViews[model.id];
        deletedView.$el.remove();
        delete this.groupViews[model.id];
    },

    render : function(insertIntoTree) {
        console.info("render PackGroupedView");
        if (this.model.get('active')) {

            console.info("rendering PackGroupedView pack=" + this.model.get('name') + ", active=" + this.model.get('active'));

            if (insertIntoTree) {
                // if it is a first render
                if (!this.$packGroups.is(":visible")) {
                    this.$el.html(this.$packGroups);
                }
            }

            // rendering group view where it belongs
            _.each(this.model.groups.models, function(model, index) {
                var view = this.groupViews[model.id];
                if (!view) {
                    view = this.prepareNewModel(model);
                }
                if (!view.$el.is(":visible")) {
                    var existingDOMel = $(".packGroup:nth-child(" + (index + 1) + ")", this.$packGroups);
                    if (existingDOMel.length == 0) {
                        this.$packGroups.append(view.render().$el);
                    } else {
                        existingDOMel.before(view.render().$el);
                    }
                }
            }, this);
        } else {
            console.info("pack=" + this.model.get('name') + " render event, but nothing to do");
        }
        return this;
    },
    showMessage : function(message) {
        console.info("showing message " + message);
    },
});
