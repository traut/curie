
var AppRouter = Backbone.Router.extend({

    routes : {
        "p/:pack": "showPack",
        "p/:pack/:message": "showMessage",

        "new/:draftid": "newDraft",
        "new": "newDraft",

        "search/:encodedquery/:message": "showSearchMessage",
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
    },

    showMessage : function(pack, message) {
        stateModel.set("activePackName", pack);
        stateModel.trigger("showMessage", message);
    },

    showSearchMessage : function(encodedquery, message) {
        this.search(encodedquery);
        stateModel.trigger("showMessage", message);
    },

    showGroup : function(pack, group) {
        stateModel.set("activePackName", pack);
    },

    showDashboard : function() {
        console.info("showing dashboard");
        stateModel.set("activePackName", null);
    },

    newDraft : function(draftId) {
        stateModel.trigger("newDraft", draftId);
    },

    search : function(encodedquery) {
        stateModel.trigger("searchRequest", encodedquery);
    }
});
