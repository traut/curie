
var PackListView = Backbone.View.extend({
    template : Handlebars.templates.packList,

    initialize : function() {

        this.$el = $('<ul class="nav nav-list well packs"></ul>');

        stateModel.on("change:activePackName", this.updateActive, this);
        stateModel.on("change:selectedPackName", this.updateSelected, this);

        this.model.on("change:unread", this.updateBadge, this);
        this.model.on("add reset remove", this.render, this);

    },
    render : function() {
        console.info("rendering PackListView", this.model.toJSON());

        var renderData = _.map(this.model.toJSON(), function(el) {
            el.hashUrl = window.curie.router.reverse('showPack', {pack : el.name});
            if (el.name == stateModel.get("activePackName")) {
                el.active = true;
            }
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

        var packSelector = slugifySelector(packName);
        $("a.pack:not([name=" + packSelector + "])", this.$el).parents("li").removeClass(cls);

        // checking if this pack is in this PackList
        var packFound = this.model.findWhere({name : packName});

        if (packFound) {
            console.info("UPDATE ACTIVE", packName, packSelector, packFound, this.model);
            $("a[name=" + packSelector + "].pack", this.$el).parents("li").addClass(cls);
            console.info("CLASS ADDED TO", $("a[name=" + packSelector + "].pack", this.$el));
            this.updateDocumentTitle(packName, packFound.get("unread"));
        }
    },
    updateSelected : function(i, packName) {
        var cls = "selected";

        var packSelector = slugifySelector(packName);

        $("a.pack:not([name=" + packSelector + "])", this.$el).removeClass(cls);
        var packFound = this.model.findWhere({name : packName});
        if (packFound) {
            $("a[name=" + packSelector + "].pack", this.$el).addClass(cls);
        }
    },
    updateBadge : function(model, value) {
        var packName = model.get('name');
        var packSelector = slugifySelector(packName);
        var badge = $(".nav a[name=" + packSelector + "].pack .counters");
        console.warn("BADGE: ", badge);
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
    events : {
        "click button[name=showAs]" : "showPackAs",
        "focusout input[name=search]" : "hideSearch",
        "submit form#searchForm" : "makeSearchEvent"
    },
    initialize : function() {
        stateModel.on("fetchFinished", this.updateLastFetchTime, this);
        stateModel.on("login", this.updateAccountInfo, this);

        stateModel.on("showSearch", this.showSearch, this);
        stateModel.on("hideSearch", this.hideSearch, this);
        stateModel.on("escPressed", this.hideSearch, this);

        stateModel.on("newDraft", function() {
            $("#newMessageLi").addClass("active");
        });

        stateModel.on("hideDraft", function() {
            $("#newMessageLi").removeClass("active");
        });
    },
    render : function(selectedPack) {
        return this;
    },
    showPackAs : function(e) {
        var style = $(e.currentTarget).data("value");
        if (PACK_STYLES[style]) {
            stateModel.trigger("showPackAs", PACK_STYLES[style]);
        }
    },
    showSearch : function() {
        $("#searchPopup").show();
        $("input", "#searchPopup").focus();
    },
    hideSearch : function() {
        $("#searchPopup").hide();
        $("input", "#searchPopup").val('');

    },
    updateLastFetchTime : function() {
        $("#lastFetchTime", this.$el).text(moment().format('HH:mm:ss, dddd, MMM Do'));
    },
    updateAccountInfo : function(email) {
        $("#accountInfo", this.$el).text(email);
    },
    makeSearchEvent : function(e) {
        e.preventDefault();
        var query = $("#searchPopup form input[name=search]").val();
        if (query) {
            window.curie.router.navigate(window.curie.router.reverse("search", {
                encodedquery : utf8_to_b64(query)
            }), {trigger : true});
        }
        return false;
    },
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


