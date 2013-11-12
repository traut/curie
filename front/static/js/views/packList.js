
var PackListView = Backbone.View.extend({
    template : Handlebars.templates.packList,

    tagName : 'ul',
    attributes : {
        'class' : 'nav nav-list well packs'
    },

    initialize : function() {
        this.collection.on("change:unread", this.updateBadge, this);
        this.collection.on("add reset remove", this.render, this);
    },
    render : function() {
        console.info("rendering PackListView", this.collection.pluck("name"));
        if (this.collection.length == 0) {
            return;
        }

        var renderData = _.map(this.collection.toJSON(), function(el) {
            el.hashUrl = curie.router.reverse('showPack', {pack : el.name});
            //el.active = (el.name == curie.state.get("activePack").get("name"));
            return el;
        });
        this.$el.html(this.template({ packs : renderData }));
        return this;
    },
    updateActive : function(pack) {
        var name = (pack == null) ? "" : slugifySelector(pack.get("name"));

        var cls = "active";
        this.$("li:not([data-pack=" + name + "])").removeClass(cls);
        this.$("li[data-pack=" + name + "]").addClass(cls);
    },
    updateSelected : function(pack) {
        var name = (pack == null) ? "" : slugifySelector(pack.get("name"));

        var cls = "selected";
        this.$("li:not([data-pack=" + name + "])").removeClass(cls);
        this.$("li[data-pack=" + name + "]").addClass(cls);
    },
    updateBadge : function(pack, value) {
        var badge = $(".nav a[name=" + pack.cid + "].pack .counters");
        if (value == 0) {
            badge.hide();
        } else {
            badge.html(value).show();
            this.updateDocumentTitle(pack, value);
        }
    },
});

