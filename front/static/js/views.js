
var MessageRowView = Backbone.View.extend({
    tagName : 'tr',
    initialize : function() {
        this.model.on({
            "change" : this.render,
            "destroy" : this.remove
        });
    },
    render : function() {
        $(this.el).html(
            '<td>' + escapeHTML(this.model.get('from')) + '</td>' + 
            '<td>' + escapeHTML(this.model.get('subject')) + '</td>' +
            '<td>' + new Date(this.model.get('received')) + '</td>'
        );
        if (!this.model.get('read')) {
            $(this.el).addClass("unseen");
        }
        return this;
    },
});

var PackView = Backbone.View.extend({
    el : ".app",
    initialize : function() {

        this.model.messages.on("reset add remove", this.render, this);

        this.model.messages.on("fetch:start", this.showLoader, this);
        this.model.messages.on("fetch:end", this.hideLoader, this);

        this.listBody = $("#messages-list tbody", this.el);

        this.packLiEl = $(".nav a.pack[name=" + this.model.get('name') + "]", this.el).parent();
        this.allLiEls = $(".nav a.pack", this.el).parent();
        this.badge = $(".badge", this.packLiEl);

        this.active = false;

        this.newCounter = 0;

        //FIXME: add packs menu here
    },
    activate : function() {

        console.info("Activating PackView " + this.model.get('name'));

        this.active = true;
        this.allLiEls.removeClass("active");
        this.packLiEl.addClass("active");
        this.render();
    },
    render : function() {
        console.info("HEY");

        console.info("Rendering PackView " + this.model.get('name') + ", active=" + this.active);

        this.updateBadge();

        if (this.active) {
            var listBody = this.listBody;
            listBody.empty();
            this.model.messages.each(function(message) {
                listBody.append(new MessageRowView({model : message}).render().el);
            });
        }

        /*
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
        */
        return this;
    },
    updateBadge : function() {
        var unread = this.model.messages.getUnread().length;
        console.info("updating the badge to " + unread);
        if (unread == 0) {
            this.badge.hide();
        } else {
            this.badge.html(unread).show();
        }
    },
    showLoader : function() {
        $(".loader", this.packLiEl).html("<img src='/static/img/loader.gif'/>");
    },
    hideLoader : function() {
        $(".loader", this.packLiEl).empty();
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

        this.lastFetchTimeEl = $("#lastFetchTime");
    },
    render : function(selectedPack) {
        this.getPackByName(selectedPack || "inbox").activate();
        return this;
    },
    activatePack : function(packName) {
        document.title = packName;
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
    fetchPacks : function() {

        var self = this;
        var updateFetchTime = _.after(this.packs.length, function() {
            self.updateLastFetchTime();
        });

        this.packs.map(function(p) {
            p.model.messages.fetch({update: true});
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

