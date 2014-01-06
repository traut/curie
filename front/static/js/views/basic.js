var PopupView = Backbone.View.extend({
    events : {
        "click button.close" : "navigateAway",
        "click button[name=back]" : "navigateAway",
        "click button[name=delete]" : "deleteActive",
    },
    initialize : function(options) {
        _.bindAll(this);
        this.currentSubview = null;
    },
    render : function(subview) {

        this.currentSubview && this.currentSubview.close();
        this.currentSubview = subview;

//        this.topOffset =  window.pageYOffset || 35;
//        var parentOffset = this.$el.parent().offset().top;
//        this.$el.css("top", this.topOffset - parentOffset);

        //subview.render();
        this.$(".content").html(subview.$el);

        $("#contentView").css({ "height" : "100px", "overflow" : "hidden" });
        this.$el.show();
    },
    hide : function() {
        $("#contentView").css({ "height" : "auto", "overflow" : "auto" });
        this.$el.hide();
        this.$(".content").empty();

        this.currentSubview && this.currentSubview.close();
        this.currentSubview = null;
        return this;
    },
    navigateAway : function() {
        this.hide();
        curie.state.trigger("navigate:activePack");
    },
    deleteActive : function() {
        console.error("Not implemented yet");
        alert("Sorry, not implemented yet");
    },
    getSubview : function() {
        return this.currentSubview;
    }
});

var AppView = Backbone.View.extend({
    el : ".app",
    template : Handlebars.templates.base,
    events : {
        "click [name=new-message] a" : "showNewDraft",
        "click [name=search] a" : "showSearchLink",
        "click [name=filters] a" : "showFilters",

        "blur #searchPopup form" : "hideSearch",
        "submit #searchPopup form" : "makeSearchEvent",
        "keyup #searchPopup input[name=search]" : "escPressed",
    },
    initialize : function() {
        _.bindAll(this);
    },
    render : function() {
        this.$el.html(this.template());
    },
    showSearch : function() {
        var searchPopup = this.$("#searchPopup");
        searchPopup.show();
        $("input", searchPopup).focus();
    },
    hideSearch : function(e) {
        if (e && this.$("#searchPopup").has(e.relatedTarget).length > 0) {
            return;
        }
        var searchPopup = this.$("#searchPopup");
        searchPopup.hide();
        $("input", searchPopup).val('');
    },
    showMainBlock : function() {
        this.$(".mainBlock").show();
    },
    showNewDraft : function(e) {
        e && e.preventDefault();
        curie.controllers.layout.showDraft();
    },
    showSearchLink : function(e) {
        e && e.preventDefault();
        this.showSearch();
    },
    showFilters : function(e) {
        e && e.preventDefault();
        curie.controllers.layout.showFilters();
    },
    escPressed : function(e) {
        if (e.keyCode == 27) {
            Mousetrap.trigger("esc");
        };
    },
    makeSearchEvent : function(e) {
        e.preventDefault();
        var query = this.$("#searchPopup form input[name=search]").val().trim();
        if (query && query.length > 0) {
            console.info('"' + query + '"');

            curie.router.navigate(
                curie.router.reverse("search", { encodedquery : curie.controllers.data.extendAndEncodeQuery(query) }),
                {trigger : true}
            );
        }
        return false;
    }
});


