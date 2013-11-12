var PopupView = Backbone.View.extend({
    events : {
        "click button.close" : "navigateAway",
    },
    initialize : function(options) {
        _.bindAll(this);
        this.currentSubview = null;
    },
    render : function(subview) {

        this.currentSubview = subview;

        this.topOffset =  window.pageYOffset || 15;

        this.$el.css("top", this.topOffset);

        subview.render();

        this.$(".content").html(subview.$el);

        this.$el.show();
    },
    hide : function() {
        this.$el.hide();
        this.$(".content").empty();

        this.currentSubview && this.currentSubview.close();
        this.currentSubview = null;
        return this;
    },
    navigateAway : function() {
        this.hide();
        curie.state.trigger("navigate:activePack");
    }
});

var AppView = Backbone.View.extend({
    el : ".app",
    template : Handlebars.templates.base,
    events : {
        "click #newMessageLi a" : "showNewDraft",

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
    showNewDraft : function() {
        alert("show new draft");
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
            window.curie.router.navigate(
                window.curie.router.reverse("search", { encodedquery : utf8_to_b64(query) }),
                {trigger : true}
            );
        }
        return false;
    }
});


