
var AppRouter = Backbone.Router.extend({

    routes : {
        "p/:pack": "showPack",
        "p/:pack/:message": "showMessage",
        "p/:pack/g/:group": "showGroup",

        "new/:draftid": "newDraft",
        "new": "newDraft",

        "search/:query": "search",
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
        this.controller.packModels.activate(pack);
        this.controller.getPackViewByName(pack).showMessage(message);
    },

    showGroup : function(pack, group) {
        this.controller.packModels.activate(pack);
        this.controller.showGroup(pack, group);
    },

    showDashboard : function() {
        console.info("showing dashboard");
        stateModel.set("activePackName", null);
    },

    newDraft : function(draftId) {
        stateModel.trigger("newDraft", draftId);
    },

    search : function() {
    }
});
