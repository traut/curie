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

        // FIXME: should be replaces with a proper middleware
        this.allMessages = this.options.allMessages;

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
            messages : this.model.get("topMessages").toJSON(),
            thereIsMore : this.model.get("size") > this.model.get("topMessages").length
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

var PackGroupedView = Backbone.View.extend({
    el : "#packView",

    initialize : function() {

        //this.model.groups.on("reset", this.render, this);
        this.model.groups.on("add", this.addGroup, this);
        this.model.groups.on("remove", this.removeGroup, this);

        this.groupViews = {};
        this.groupViewClass = this.options.groupViewClass || MessageGroupListView;

        this.messageViews = {};

        this.$packGroups = $('<div id="pack-groups" class="packGroups">');
    },

    prepareNewModel : function(model, collection) {

        collection = collection || this.model.groups;

        var modelsWithoutViews = _.filter(collection.models, function(model) {
            return !this.groupViews[model.id];
        }, this);

        _.each(modelsWithoutViews, function(model) {
            console.info("Looking at", model);
            if (model.get("size") < 2 && this.groupViewClass == MessageGroupListView) {
                this.groupViews[model.id] = new MessageRowView({
                    model : model.get("topMessages").at(0),
                    pack : this.model.get('name'),
                });
            } else {
                this.groupViews[model.id] = new this.groupViewClass({
                    model : model,
                    pack : this.model.get('name'),
                    allMessages : this.model.messages,
                });
            }
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

    render : function() {
        console.info("render PackGroupedView");
        if (this.model.get('active')) {
            console.info("rendering PackGroupedView pack=" + this.model.get('name') + ", active=" + this.model.get('active'));

            if (!isElementInDOM(this.$packGroups)) {
                this.$el.html(this.$packGroups);
            }

            // rendering group view where it belongs
            _.each(this.model.groups.models, function(model, index) {
                var view = this.groupViews[model.id];
                if (!view) {
                    view = this.prepareNewModel(model);
                }
                if (!isElementInDOM(view.$el)) {
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
        console.info("PackGroupedView: showing message " + message);
        this.messageViews[message] = this.messageViews[message] || new MessageView({
            model : new MessageFull({
                id: message
            })
        });
        _.each(this.messageViews, function(mv, messageId) {
            if (messageId == message) {
                console.info("View for " + messageId + " found. show()");
                mv.show();
            } else {
                mv.hide();
            }
        }, this);
    },
});

var some = [];

var GroupView = Backbone.View.extend({
    el : "#packView",

    template : Handlebars.templates.groupView,

    initialize : function() {

        this.model.messages.on("add", this.addMessage, this);
        this.model.messages.on("remove", this.removeMessage, this);

        this.messageRowViews = {};
        this.messageViews = {};

        this.$mainBlock = $(this.template({
            packUrl : window.curie.router.reverse("showPack", { pack : this.model.get("pack") }),
            pack : this.model.get("pack"),
            value : this.model.get("searchValue"),
            unread : this.model.get("unread"),
            size : this.model.get("size")
        }));

        this.$messageList = $(".messageList", this.$mainBlock);

        //this.model.messages.on("change:unread", this.showLoader, this);
        //this.model.messages.on("fetch:end", this.hideLoader, this);
        
    },
    prepareNewModel : function(model, collection) {
        collection = collection || this.model.messages;

        var modelsWithoutViews = _.filter(collection.models, function(model) {
            return !this.messageRowViews[model.id];
        }, this);
        _.each(modelsWithoutViews, function(model) {
            this.messageRowViews[model.id] = new MessageRowView({
                model : model,
                pack : this.model.get("name")
            });
            console.info("View added for " + model.id);
        }, this);
        return this.messageRowViews[model.id];
    },
    addMessage : function(model, collection) {
        console.info("Adding message", model);
        this.prepareNewModel(model);
        this.render();
    },
    removeMessage : function(model, collection, options) {
        console.info("deleting message " + model.id);
        var deletedView = this.messageRowViews[model.id];
        deletedView.$el.remove();
        delete deletedView;
    },
    render : function() {
        console.info("rendering GroupView pack=" + this.model.get('pack') + ", searchValue=" + this.model.get('searchValue'));

        if (!isElementInDOM(this.$mainBlock)) {

            // rerender to show previously unknown "unread" and "size"
            this.$mainBlock = $(this.template({
                packUrl : window.curie.router.reverse("showPack", { pack : this.model.get("pack") }),
                pack : this.model.get("pack"),
                value : this.model.get("searchValue"),
                unread : this.model.get("unread"),
                size : this.model.get("size")
            }));

            this.$messageList = $(".messageList", this.$mainBlock);
            this.$el.html(this.$mainBlock);
        }

        // hiding all the message views
        _.each(_.values(this.messageViews), function(mv) {
            mv.hide();
        });

        // rendering message row view where it belongs
        
        _.each(this.model.messages.models, function(model, index) {
            var view = this.messageRowViews[model.id];
            if (!view) {
                view = this.prepareNewModel(model);
            }
            if (!isElementInDOM(view.$el)) {
                console.info("showing " + model.id);
                var existingDOMel = $(".messageRow:nth-child(" + (index + 1) + ")", this.$messageList);
                if (existingDOMel.length == 0) {
                    this.$messageList.append(view.render().$el);
                } else {
                    existingDOMel.before(view.render().$el);
                }
            }
        }, this);
        return this;
    },
    showMessage : function(message) {
        console.info("GroupView: showing message " + message);
        this.messageViews[message] = this.messageViews[message] || new MessageView({
            model : new MessageFull({
                id: message
            })
        });
        console.info(this.messageViews);
        _.each(this.messageViews, function(mv, messageId) {
            if (messageId == message) {
                console.info("View for " + messageId + " found. show()");
                mv.show();
            } else {
                mv.hide();
            }
        }, this);
    },
});


var PackListView = Backbone.View.extend({
    el : "#packList",
    template : Handlebars.templates.packList,
    initialize : function() {

        var self = this;

        this.model.on("change:active", this.updateActive, this);
        this.model.on("change:selected", this.updateSelected, this);

        this.model.on("add reset", function(model) {
            console.info("mapping to model " + model.get("name"));
            model.messages.on("change:unread reset add remove", self.badgeUpdaterFor(model), self);
        });
    },
    render : function(selectedPack) {
        console.info("rendering PackListView");
        this.model.models.map(function(p) {
            if (!p.get('hashUrl')) {
                p.set('hashUrl', window.curie.router.reverse('showPack', {pack : p.get('name')}));
            }
        });
        this.$el.html(
            this.template({ packs : this.model.toJSON() })
        );
        return this;
    },
    updateDocumentTitle : function(packName, badge) {
        if (badge && badge > 0) {
            document.title = packName + "(" + badge +") - Curie";
        } else {
            document.title = packName + " - Curie";
        }
    },
    updateActive : function(m) {
        var packName = m.get('name');
        var activeClass = "active";

        var el = $("a[name=" + packName + "].pack").parents("li");
        if (m.changed.active == true) {
            if (el && !el.hasClass(activeClass)) {
                el.addClass(activeClass);
                this.updateDocumentTitle(packName);
            }
        } else if (m.changed.active == false) {
            el.removeClass(activeClass);
        }
    },
    updateSelected : function(m) {
        var packName = m.get('name');
        var selectedClass = "selected";

        var el = $("a[name=" + packName + "].pack");
        if (m.changed.selected == true) {
            if (el && !el.hasClass(selectedClass)) {
                el.addClass(selectedClass);
            }
        } else if (m.changed.selected == false) {
            el.removeClass(selectedClass);
        }
    },
    badgeUpdaterFor : function(packModel) {
        var packName = packModel.get('name');
        function updateBadge(m) {
            console.info("updating badge pack=" + packName + ", message=" + m.get("id"));

            var badge = $(".nav a[name=" + packName + "].pack .badge");
            var unread = packModel.messages.getUnreadCount();
            if (unread == 0) {
                badge.hide();
            } else {
                badge.html(unread).show();
            }
            if (this.model.get("active")) {
                updateDocumentTitle(packName, unread);
            }
        }
        return updateBadge;
    },
});
