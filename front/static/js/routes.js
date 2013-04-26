
var AppRouter = Backbone.Router.extend({

    routes : {
        "p/:pack": "showPack",
        "p/:pack/:message": "showMessage",
        "new": "newMessage",
        "search/:query": "search",
    },

    initialize : function(appView) {
        this.view = appView;
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
        this.view.packModels.activate(pack);
        this.view.packModels.renderEvent(pack);
    },

    showMessage : function(pack, message) {
        this.view.packModels.activate(pack);
        this.view.getPackViewByName(pack).showMessage(message);
    },

    newMessage : function(query, page) {
    },

    search : function() {
    }
});
