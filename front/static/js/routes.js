
var AppRouter = Backbone.Router.extend({

    routes: {
        "p/:pack": "showPack",
        "new": "newMessage",
        "search/:query": "search",
    },

    initialize : function(appView) {
        this.view = appView;
    },

    showPack : function(pack) {
        this.view.activatePack(pack);
    },

    newMessage : function(query, page) {
    },

    search : function() {
    }
});
