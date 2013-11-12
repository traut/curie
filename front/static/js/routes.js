
Curie.Router = Backbone.Router.extend({

    routes : {
        "p/:pack/:message": "showMessage",
        "p/:pack": "showPack",

        "p/:pack/t/:thread": "showThread",

        "search/:encodedquery/:message": "showSearchMessage",
        "search/:encodedquery/:thread": "showSearchThread",
        "search/:encodedquery": "search",

        "p/:pack/new/to/:email": "showDraftWithTo",
        "p/:pack/new/:draftid": "showDraft",
        "p/:pack/new/": "showDraft",
        "search/:encodedquery/new/to-:email": "showSearchDraftWithTo",
        "search/:encodedquery/new/:draftid": "showSearchDraft",
        "search/:encodedquery/new/": "showSearchDraft",

        "": "showDashboard",
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

    navigateToPack : function(instance) {
        var url = null;
        if (instance instanceof Pack) {
            url = this.reverse('showPack', {pack : instance.get("name")});
        } else if (instance instanceof SearchResults) {
            url = this.reverse('search', {encodedquery : instance.queryHash});
        } else {
            console.error("Can't navigate to pack", instance);
            return;
        }
        this.navigate(url, {trigger : true});
    },

    navigateToDraftInContext : function(instance, draftId) {
        var url = null;
        if (instance instanceof Pack) {
            url = this.reverse('showDraft', {pack : instance.get("name"), draftId : draftId});
        } else if (instance instanceof SearchResults) {
            url = this.reverse('showSearchDraft', {encodedquery : instance.get("query"), draftId : draftId});
        } else {
            console.error("Can't navigate to pack", instance);
            return;
        }
        this.navigate(url, {trigger : true});
    },

    // views

    showPack : function(pack) {
        console.info("routing to pack " + pack);
        curie.state.setPackByName(pack);
    },

    showMessage : function(pack, message) {
        curie.state.setPackByName(pack);
        curie.controllers.layout.showMessage(message);
    },

    showThread : function(pack, thread) {
        curie.state.setPackByName(pack);
        curie.controllers.layout.showThread(thread);
    },

    showSearchMessage : function(encodedquery, message) {
        this.search(encodedquery);
        curie.controllers.layout.showMessage(message);
    },

    showSearchThread : function(encodedquery, thread) {
        this.search(encodedquery);
        curie.controllers.layout.showThread(thread);
    },

    showDashboard : function() {
        console.info("showing dashboard");
        curie.state.setPackByName(null);
    },

    showDraft : function(pack, draftId) {
        curie.state.setPackByName(pack);
        curie.controllers.layout.showDraft(draftId);
    },

    showSearchDraft : function(encodedquery, draftId) {
        this.search(encodedquery);
        curie.controllers.layout.showDraft(draftId);
    },

    showDraftWithTo : function(pack, email) {
        curie.state.setPackByName(pack);
        curie.controllers.layout.showDraft(null, email);
    },

    showSearchDraftWithTo : function(encodedquery, email) {
        this.search(encodedquery);
        curie.controllers.layout.showDraft(null, email);
    },

    search : function(encodedquery) {
        curie.controllers.layout.showSearchResults(encodedquery);
    }
});
