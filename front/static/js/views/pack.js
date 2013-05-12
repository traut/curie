
var PackView = Backbone.View.extend({
    initialize : function() {

        stateModel.on("change:activePackName", this.changeActivePack, this);
        stateModel.on("showPackAs", this.changePackStyle, this);

        this.model.messages.on("add", this.addMessage, this);
        this.model.messages.on("remove", this.removeMessage, this);

        this.model.groups.on("add", this.addGroup, this);
        this.model.groups.on("remove", this.removeGroup, this);

        this.activeStyle = "list";

        this.styles = {
            list : {
                models : this.model.messages,
                el : $('<div id="messages-list" class="messageList">'),
                selector : ".messageRow",
                idPrefix : "message-row-",
                views : {},
                viewClass : MessageRowView
            },
            tiles : {
                models : this.model.groups,
                el : $('<div id="pack-groups" class="packGroups">'),
                selector : ".packGroup",
                idPrefix : "message-group-",
                views : {},
                views : {},
                viewClass : MessageGroupView,
            },
            combined : {
                models : this.model.groups,
                el : $('<div id="pack-groups" class="packGroups">'),
                selector : ".packGroup",
                idPrefix : "message-group-",
                views : {},
                viewClass : MessageGroupListView,
            },
        };

        console.info("PackView for " + this.model.get("name") + " initialized");
    },

    getActiveStyle : function() {
        return this.styles[this.activeStyle];
    },

    createSubView : function(model, collection) {
        var style = this.getActiveStyle();
        collection = collection || style.models;

        var modelsWithoutViews = _.filter(collection.models, function(model) {
            return !style.views[model.id]
        }, this);
        _.each(modelsWithoutViews, function(model) {
            style.views[model.id] = new style.viewClass({
                model : model,
                pack : this.model.get("name")
            });
            console.info("subview added for " + model.id + " to style " + this.activeStyle);
        }, this);
        return style.views[model.id];
    },

    changePackStyle : function(newStyle) {
        if (newStyle != this.activeStyle) {
            this.activeStyle = newStyle;
            this.insertElement();
            this.render();
        }
    },

    addMessage : function(model, collection) {
        if (this.activeStyle == "list") {
            console.info("Adding message", model);
            this.createSubView(model, collection);
            this.render();
        }
    },

    addGroup : function(model, collection) {
        if (this.activeStyle == "combined" || this.activeStle == "tiles") {
            console.info("Adding group", model);
            this.createSubView(model, collection);
            this.render();
        }
    },

    removeMessage : function(model, collection, options) {
        // FIXME: broken
        console.info("deleting message " + model.id);
        var deletedView = this.messageRowViews[model.id];
        console.info(deletedView);
        deletedView.$el.remove();
        delete deletedView;
    },

    insertElement : function() {
        var style = this.getActiveStyle();
        if (!isElementInDOM(style.el)) {
            console.info("adding PackView to DOM: pack=" + this.model.get('name') + ", " + this.activeStyle);
            $("#packView").html(style.el);
        }
    },

    changeActivePack : function(i, activePackName) {
        var style = this.getActiveStyle();

        console.info(this.model.get("name"), this.activeStyle, activePackName, (this.model.get("name") == activePackName), isElementInDOM(style.el));

        if (this.model.get("name") == activePackName) {
            this.insertElement();
        } else if (i && this.model.get("name") != activePackName && isElementInDOM(style.el)) {
            style.el.remove();
            return;
        }

        this.render();
    },

    render : function(i, activePackName) {

        var style = this.getActiveStyle();

        style.models.map(function(model, index) {
            var view = style.views[model.id];
            if (!view) {
                view = this.createSubView(model);
            }
            if ($("#" + style.idPrefix + model.id, style.el).length == 0){
                console.info("adding view for " + model.id + " to element", style.el);
                var existingDOMel = $(style.selector + ":nth-child(" + (index + 1) + ")", style.el);
                if (existingDOMel.length == 0) {
                    style.el.append(view.render().$el);
                } else {
                    existingDOMel.before(view.render().$el);
                }
            }

        }, this);

        return this;
    }
});

