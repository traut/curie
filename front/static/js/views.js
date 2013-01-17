
var MessageRowView = Backbone.View.extend({
    tagName : 'tr',
    render : function() {
        $(this.el).html('<td>' + this.model.get('from') + '</td><td>' + this.model.get('subject') + '</td>');
        return this;
    },
});

var PackView = Backbone.View.extend({
    el : ".app",
    initialize : function() {

        this.model.messages.bind("add", this.addMessage, this);
        this.model.messages.bind("add", this.updateBadge, this);

        this.listBody = $("#messages-list tbody", this.el);

        this.packLiEl = $(".nav a.pack[name=" + this.model.get('name') + "]", this.el).parent();
        this.allLiEls = $(".nav a.pack", this.el).parent();
        this.badge = $(".badge", this.packLiEl);

        this.active = false;
    },
    activate : function() {
        this.active = true;
        this.markAsActive();
        this.render();
    },
    markAsActive : function() {
        this.updateBadge();
        this.allLiEls.removeClass("active");
        this.packLiEl.addClass("active");
    },
    render : function() {

        this.listBody.empty();
        this.showLoader();

        var self = this;
        this.model.messages.fetch({
            success : function(coll, response) {
                self.hideLoader();
                self.updateBadge();
                coll.each(function(message) {
                    self.listBody.append(new MessageRowView({model : message}).render().el);
                });
            },
            error : function() {
                self.hideLoader();
                console.error("ERROR!");
            }
        });
        return this;
    },
    addMessage : function(model, collection, options) {
        if (this.active) {
            var render = new MessageRowView({model : model}).render().el;
            if (options.index == 0) {
                $("tr:first", this.listBody).before(render);
            } else {
                this.listBody.append(render);
            }
        } 
    },
    showLoader : function() {
        $(".loader", this.packLiEl).html("<img src='/static/img/loader.gif'/>");
    },
    hideLoader : function() {
        $(".loader", this.packLiEl).empty();
    },
    updateBadge : function() {
        var unread = this.model.messages.getUnread().length;
        if (unread == 0) {
            this.badge.hide();
        } else {
            this.badge.html(unread).show();
        }
    },
    hideBadge : function() {
        $(".badge", this.packLiEl).empty().hide();
    }
});

var AppView = Backbone.View.extend({
    el : ".app",
    events : {
    },
    initialize : function(packsNames) {
        this.packs = _.map(packsNames, function(p) {
            return new PackView({ model : new Pack(p) });
        });
    },
    render : function(selectedPack) {
        this.getPackByName(selectedPack || "inbox").activate();
        return this;
    },
    activatePack : function(packName) {
        document.title = packName + " — Goldfinch";
        _.each(this.packs, function(p) {
            p.active = false;
        });
        this.getPackByName(packName).activate();
    },
    getPackByName : function(packName) {
        return _.find(this.packs, function(p) {
            return p.model.get('name') == packName;
        });
    },
    addMessage : function(pack, message) {
        this.getPackByName(pack).model.messages.unshift(message);
        console.info("message pushed");
    }
});

