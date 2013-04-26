function dummy() {};

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
        this.model.bind("change:unread", this.renderUnread, this);
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
    renderUnread : function(e) {
        if (e.changed.unread == true) {
            $("#message-row-" + this.model.id).addClass("unread");
        } else if (e.changed.unread == false) {
            $("#message-row-" + this.model.id).removeClass("unread");
        }

    }
});

var PackView = Backbone.View.extend({
    el : "#packView",
    template : Handlebars.templates.messageList,

    initialize : function() {

        this.model.on("change:active", this.render, this);
        this.model.on("render", this.render, this);

        this.model.messages.on("reset", this.render, this);

        this.model.messages.on("add", this.addMessage, this);
        this.model.messages.on("remove", this.removeMessage, this);

        this.messageRowViews = {};
        this.messageViews = {};

        this.$messageList = $('<div id="messages-list" class="messageList">');

        //this.model.messages.on("change:unread", this.showLoader, this);
        //this.model.messages.on("fetch:end", this.hideLoader, this);
        
    },
    addMessage : function(model, collection) {
        console.info("Adding message", model);
        //FIXME: for now, adding it to the top, but should keep a sorted list of models in memory
        var packName = this.model.get("name");

        var modelsWithoutViews = _.filter(collection.models, function(model) {
            return !this.messageRowViews[model.id];
        }, this);
        _.each(modelsWithoutViews, function(model) {
            this.messageRowViews[model.id] = new MessageRowView({
                model : model,
                pack : packName
            });
            console.info("View added for " + model.id);
        }, this);
        this.render();
    },
    removeMessage : function(model, collection, options) {
        var deletedView = this.messageRowViews[model.id];
        console.info(deletedView);
        deletedView.$el.remove();
        delete deletedView;
    },
    render : function() {
        if (this.model.get('active')) {
            console.info("rendering PackView pack=" + this.model.get('name') + ", active=" + this.model.get('active'));

            // if it is a first render
            if (!this.$messageList.is(":visible")) {
                this.$el.html(this.$messageList);
            }

            // hiding all the message views
            _.each(_.values(this.messageViews), function(mv) {
                mv.hide();
            });

            // rendering message row view where it belongs
            _.each(this.model.messages.models, function(model, index) {
                var view = this.messageRowViews[model.id];
                if (!view.$el.is(":visible")) {
                    var existingDOMel = $(".messageRow:nth-child(" + (index + 1) + ")", this.$messageList);
                    if (existingDOMel.length == 0) {
                        this.$messageList.append(view.render().$el);
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
    showLoader : function() {
        $(".loader", this.packLiEl).html("<img src='/static/img/loader.gif'/>");
    },
    hideLoader : function() {
        $(".loader", this.packLiEl).empty();
    },
    showMessage : function(message) {
        console.info("showing message " + message);
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


var PackListView = Backbone.View.extend({
    el : "#packList",
    template : Handlebars.templates.packList,
    initialize : function() {

        var self = this;

        this.model.on("change:active", this.updateActive, this);
        this.model.on("add reset", function(model) {
            console.info("mapping to model " + model.get("name"));
            model.messages.on("change reset add remove", self.badgeUpdaterFor(model), self);
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

        console.info("updating active " + packName);

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

var AppView = Backbone.View.extend({
    el : ".app",
    initialize : function(packsNames) {
        var self = this;

        var packModels = this.packModels = new Packs();
        this.packListView = new PackListView({
            model : this.packModels
        });
        var packViews = this.packViews = [];

        _.map(packsNames, function(p) {
            var model = new Pack({ name : p });
            packModels.add(model);
            packViews.push(new PackView({ model : model }));
        });

        this.lastFetchTimeEl = $("#lastFetchTime");
    },
    render : function(selectedPack) {
        console.info("rendering appView");
        this.packListView.render();
        return this;
    },
    deactivatePack : function(packName) {
        $(".nav a.pack[name=" + packName + "]", ".app");
        var allLiEls = $(".nav a.pack", ".app").parent();
    },
    getPackViewByName : function(packName) {
        return _.find(this.packViews, function(p) {
            return p.model.get('name') == packName;
        });
    },
    addMessage : function(message) {
        console.info(message);
        this.packs.map(function(pack) {
            var packName = pack.model.get('name');
            if (message.labels && message.labels.indexOf(packName) > -1) {
                pack.model.messages.add(message);
                console.info("message " + message.id + " pushed to " + packName);
            }
        });
    },
    updateLastFetchTime : function() {
        this.lastFetchTimeEl.text(moment().format('HH:mm:ss, dddd, MMM Do'));
    },
    fetchPacks : function(callback) {

        var self = this;
        var updateFetchTime = _.after(this.packListView.model.length, function() {
            self.updateLastFetchTime();
        });

        this.packListView.model.models.map(function(model) {
            model.messages.fetch({update: true});
            updateFetchTime();
        });


    }
});

