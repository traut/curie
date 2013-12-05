Curie.Views.FiltersView = Backbone.View.extend({

    template : Handlebars.templates.filters,

    tagName : 'div',
    attributes : {
        'class' : 'filters'
    },

    events : {
        "click button[name=delete]" : "deleteFilter",
        "click button[name=rerun]" : "rerunFilter",
        "click button[name=tryQuery]" : "tryQuery",

        "submit form"  : "createFilter"
    },

    initialize : function() {
        this.collection.on("change add remove", this.render, this);
    },

    render : function() {
        var filters = this.collection.toJSON();
        filters.forEach(function(f) {
            f.encoded_query = utf8_to_b64(f.query);
        });
        this.$el.html(this.template({
            filters : filters
        }));
    },

    detach : function() {
        this.collection.off(null, null, this);
        this.close();
    },

    deleteFilter : function(e) {
        console.info("delete filter", e);
        var filter = $(e.target).data("filter");
        if (filter) {
            this.collection.get(filter).destroy();
        }
    },

    rerunFilter : function(e) {
        var filterId = $(e.target).data("filter");
        if (filterId) {
            var filter = this.collection.get(filterId);
            filter.set({rerun : true});
            filter.save();
        }
    },

    createFilter : function(e) {
        e && e.preventDefault();
        var rawQuery = this.$("input[name=query]").val().trim();
        var label = this.$("input[name=label]").val().trim();
        if (!(rawQuery && rawQuery.length > 0) || !(label && label.length > 0)) {
            return;
        }
        var filter = {
            query : curie.controllers.data.extendQuery(rawQuery),
            label : label,
            skipInbox : this.$("input[name=skip]").is(':checked'),
        };
        this.collection.create(filter, {
            success : function() {
                this.$("form :input").val('');
                this.$("#testResults").html('');
            }
        }, this);
    },

    tryQuery : function(e) {
        var raw = this.$("input[name=query]").val().trim();
        if (raw && raw.length > 0) {
            console.info('Trying "' + raw + '"');

            var self = this;

            var query = curie.controllers.data.extendQuery(raw);

            var results = new Curie.Models.SearchResults({ query : query });
            results.fetch({
                update: true,
                success : function() {
                    console.info(results);
                    var view = new Curie.Views.SearchResults({ collection : results.messages, model : results});
                    view.render();
                    self.$("#testResults").html(view.$el);
                }
            });
        }
        return false;
    }
});

