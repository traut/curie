
var PackListView = Backbone.View.extend({
    template : Handlebars.templates.packList,

    initialize : function() {

        this.$el = $('<ul class="nav nav-list well packs"></ul>');

        stateModel.on("change:activePackName", this.updateActive, this);
        stateModel.on("change:selectedPackName", this.updateSelected, this);

        this.model.on("change:unread", this.updateBadge, this);
        this.model.on("add reset", this.render, this);

    },
    render : function() {
        console.info("rendering PackListView", this.model.toJSON());

        var renderData = _.map(this.model.toJSON(), function(el) {
            el.hashUrl = window.curie.router.reverse('showPack', {pack : el.name});
            return el;
        });
        this.$el.html(this.template({ packs : renderData }));
        return this;
    },
    updateDocumentTitle : function(packName, badge) {
        if (badge && badge > 0) {
            document.title = packName + " (" + badge +") - Curie";
        } else {
            document.title = packName + " - Curie";
        }
    },
    updateActive : function(i, packName) {
        var cls = "active";
        $("a.pack:not([name=" + packName + "])", this.$el).parents("li").removeClass(cls);

        var packFound = this.model.findWhere({name : packName});
        if (packFound) {
            $("a[name=" + packName + "].pack", this.$el).parents("li").addClass(cls);
            this.updateDocumentTitle(packName, packFound.get("unread"));
        }

    },
    updateSelected : function(i, packName) {
        var cls = "selected";
        $("a.pack:not([name=" + packName + "])", this.$el).removeClass(cls);

        var packFound = this.model.findWhere({name : packName});
        if (packFound) {
            $("a[name=" + packName + "].pack", this.$el).addClass(cls);
        }
    },
    updateBadge : function(model, value) {
        var packName = model.get('name');
        var badge = $(".nav a[name=" + packName + "].pack .counters");
        if (value == 0) {
            badge.hide();
        } else {
            badge.html(value).show();
            this.updateDocumentTitle(packName, value);
        }
    },
});

var AppView = Backbone.View.extend({
    el : ".app",
    initialize : function() {

        stateModel.on("fetchFinished", this.updateFetchTime, this);

    },
    render : function(selectedPack) {
        return this;
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
        $("#lastFetchTime", this.$el).text(moment().format('HH:mm:ss, dddd, MMM Do'));
    },
    //FIXME: should go to generic pack view (with different layouts)
    showAs : function(viewType) {
        var activeModel = this.packModels.getActive();
        if (!activeModel) {
            console.info("No pack selected");
            return;
        }
        var packName = activeModel.get("name");

        var wrapper = this.packViews[packName];
        wrapper.current = viewType;
        wrapper.getCurrent().render();
    },
    //FIXME: something completely different. stacked views
    showGroup : function(packName, groupValue) {
        var view = new GroupView({
            model : new SimpleSearchResults({
                searchValue : groupValue,
                searchField : "from",
                pack : packName,
                name : packName
            })
        });
        view.model.fetch({
            success : function() {
                view.render();
            }
        });
    },
});


