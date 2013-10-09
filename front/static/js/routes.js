
var AppRouter = Backbone.Router.extend({

    routes : {
        "p/:pack/new/:draftid": "showDraft",
        "p/:pack/new/": "showDraft",

        "p/:pack/:message": "showMessage",
        "p/:pack": "showPack",

        "p/:pack/t/:thread": "showThread",

        "search/:encodedquery/:message": "showSearchMessage",
        "search/:encodedquery/:thread": "showSearchThread",
        "search/:encodedquery": "search",

        "": "showDashboard",
    },

    initialize : function(controller) {
        this.controller = controller;
    },

    reverse : function(name, options) {
        for(var key in this.routes) {
            if (this.routes[key] == name) {
                var tmpl = key;
                _.each(options, function(value, key) {
                    tmpl = tmpl.replace(":" + key, value);
                });
                return tmpl;
            }
        }
    },

    navigateTo : function(name, options, navigateOptions) {
        var url = this.reverse(name, options);
        return this.navigate(url, navigateOptions);
    },

    // views

    showPack : function(pack) {
        console.info("Showing pack " + pack);
        stateModel.set("activePackName", pack);
        stateModel.trigger("navigateToActivePack");
    },

    showMessage : function(pack, message) {
        stateModel.set("activePackName", pack);
        stateModel.trigger("showMessage", message);
    },

    showThread : function(pack, thread) {
        stateModel.set("activePackName", pack);
        stateModel.trigger("showThread", thread);
    },

    showSearchMessage : function(encodedquery, message) {
        this.search(encodedquery);
        stateModel.trigger("showMessage", message);
    },

    showSearchThread : function(encodedquery, thread) {
        this.search(encodedquery);
        stateModel.trigger("showThread", thread);
    },

    showGroup : function(pack, group) {
        stateModel.set("activePackName", pack);
    },

    showDashboard : function() {
        console.info("showing dashboard");
        stateModel.set("activePackName", null);
    },

    showDraft : function(pack, draftId) {
        console.info("settings pack to " + pack);
        stateModel.set("activePackName", pack);
        stateModel.trigger("showDraft", draftId);
    },

    search : function(encodedquery) {
        stateModel.trigger("searchRequest", encodedquery);
    }
});
