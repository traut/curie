var SidebarView = Backbone.View.extend({
    template : Handlebars.templates.sidebar,

    initialize : function(options) {
        _.bindAll(this);
    },

    render : function() {
        this.$el.html(this.template());
    },

    addPackListView : function(packListView) {
        if (this.$el.has(packListView.$el).length == 0) {
            this.$("#packBlocks").append(packListView.$el);
        }
    },

    updateLastFetchTime : function() {
        this.$("#lastFetchTime").text(moment().format('HH:mm:ss, dddd, MMM Do'));
    },

    updateAccountInfo : function(account) {
        account = account || curie.state.get("account");
        var primaryMailbox = Handlebars.templates.emailAddress(account.get("primary"));
        this.$("#accountInfo").html(primaryMailbox);
    },

    showAlert : function(msg) {
        var msg = msg || "Connection error";
        this.$("#errorAlert").html(msg).show();
    },

    hideAlert : function() {
        this.$("#errorAlert").empty().hide();
    },

    toggleDraftLink : function() {
        this.$("#newMessageLi").toggleClass("active");
    }

});
