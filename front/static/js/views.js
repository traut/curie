
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
            console.info("adding unread to message");
            $("#message-" + this.model.get('id')).addClass("unread");
        } else if (e.changed.unread == false) {
            console.info("removing unread to message");
            $("#message-" + this.model.get('id')).removeClass("unread");
        }

    }
});

var PackView = Backbone.View.extend({
    el : "#packView",
    template : Handlebars.templates.messageList,

    initialize : function() {

        this.model.on("change:active", this.render, this);
        this.model.messages.on("reset add remove", this.render, this);

        this.messageRowViews = [];

        //this.model.messages.on("change:unread", this.showLoader, this);
        //this.model.messages.on("fetch:end", this.hideLoader, this);
    },
    render : function() {
        if (this.model.get('active')) {
            console.trace();
            console.info(this.model.messages);
            console.info("rendering PackView pack=" + this.model.get('name') + ", active=" + this.model.get('active'));
            var pack = this.model.get("name");
            this.messageRowViews = this.model.messages.map(function(message) {
                return new MessageRowView({
                    model : message,
                    pack : pack
                });
            });
            this.$el.html(this.template({
                rows : this.messageRowViews.map(function(rv) {
                    return {html : rv.render().$el.prop('outerHTML')};
                })
            }));
        } else {
            console.info("pack render event, but nothing to do. pack=" + this.model.get('name'));
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
        console.info("Showing message " + message);
        // show message
         
        // mark message as read
        var message = this.model.messages.get(message);
        if (message) {
            message.save("unread", false);
        } else {
            if (this.model.messages.length == 0) {
                console.info("---- saving for later");
                var self = this;
                var func = _.once(function() {
                    console.info("HEYHEY");
                    self.model.messages.get(message).save("unread", false);
                });
                this.model.messages.on("reset", func, this);
            }
        }

    },
});


var PackListView = Backbone.View.extend({
    el : "#packList",
    template : Handlebars.templates.packList,
    initialize : function() {

        var self = this;

        //this.model.on("reset add remove", this.render, this);
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
    updateActive : function(m) {
        console.info("updating active " + m.get('name'));
        var activeClass = "active";
        var el = $("a[name=" + m.get('name') + "].pack").parents("li");
        if (m.changed.active == true) {
            if (el && !el.hasClass(activeClass)) {
                el.addClass(activeClass);
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
    activatePack : function(packName) {
        this.packModels.activateOne(packName);
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
                pack.model.messages.unshift(message);
                console.info("message " + message.id + " pushed to " + packName);
            }
        });
    },
    updateLastFetchTime : function() {
        this.lastFetchTimeEl.text(new Date());
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

function escapeHTML(string) {
    var pre = document.createElement('pre');
    var text = document.createTextNode( string );
    pre.appendChild(text);
    return pre.innerHTML;
}

