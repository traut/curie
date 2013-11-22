
Curie.Router = Backbone.Router.extend({

    routes : {
        "p/draft/new/:draft": "showDraft",
        "p/:pack/t/:thread": "showThread",
        "p/:pack/:message": "showMessage",
        "p/:pack": "showPack",

        "search/:encodedquery/new/:message": "showSearchDraft",
        "search/:encodedquery/:message": "showSearchMessage",
        "search/:encodedquery/:thread": "showSearchThread",
        "search/:encodedquery": "search",

        "": "showDashboard",
    },

    __fillTemplate : function(tmpl, options) {
        _.each(options, function(value, key) {
            tmpl = tmpl.replace(":" + key, value || "");
        });
        return tmpl;
    },

    reverse : function(name, options) {
        var urlTemplates = [];

        for(var key in this.routes) {
            if (this.routes[key] == name) {
                urlTemplates.push(key);
            }
        }

        if (urlTemplates.length == 1) {
            return this.__fillTemplate(urlTemplates[0], options);
        }

        var paramNames = _.keys(options);

        var matchedUrls = urlTemplates.filter(function(t) {
            var allParamsPresent = _.every(paramNames, function(param) {
                return t.indexOf(":" + param) > -1;
            });
            console.info(t, allParamsPresent, (t.split(':').length - 1) == paramNames.length);
            return allParamsPresent && (t.split(':').length - 1) == paramNames.length
        });

        if (matchedUrls.length > 1) {
            throw new Error("More than one URL match: [" + matchedUrls.join(", ") + "], params=" + paramNames.join(", "));
        } else if (matchedUrls.length == 0) {
            throw new Error("No matches found for name=" + name + ", options=" + paramNames.join(", "));
        }

        return this.__fillTemplate(matchedUrls[0], options);
    },

    navigateTo : function(name, options, navigateOptions) {
        var url = this.reverse(name, options);
        return this.navigate(url, navigateOptions);
    },

    navigateToPack : function(instance) {
        var url = null;
        if (instance instanceof Curie.Models.Pack) {
            url = this.reverse('showPack', {pack : instance.get("name")});
        } else if (instance instanceof Curie.Models.SearchResults) {
            url = this.reverse('search', {encodedquery : instance.queryHash});
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
        if (curie.state.get("activePack").get("name") == pack) {
            curie.state.trigger("navigate:activePack");
        }
    },

    showMessage : function(pack, message) {
        console.info("showing message", pack, message);
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

    showDraft : function(draft) {
        curie.state.setPackByName("draft");
        curie.controllers.layout.showDraft(draft);
    },

    showSearchDraft : function(encodedquery, draft) {
        console.info("showing search draft", encodedquery, draft);
        this.search(encodedquery);
        curie.controllers.layout.showDraft(draft);
    },

    search : function(encodedquery) {
        curie.controllers.layout.showSearchResults(encodedquery);
    }
});
