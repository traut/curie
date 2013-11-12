
Curie.Views.CollectionGeneric = Backbone.View.extend({

    initialize : function() {

        this.rootUrl = this.options.rootUrl;
        this.modelViewClass = this.options.modelViewClass || WrappedRowView;
        this.template = this.options.template;

        this.modelViews = {};

        this.$list = $("<div></div>");

        this.collection.on("add reset", this.render, this);
        this.collection.on("sort", this.reorganizeModelViews, this);

    },

    beforeClose : function() {
        //FIXME: keep up to date
        this.collection.off("add reset", this.render);
        this.collection.off("sort", this.reorganizeModelViews);
    },


    getModelsWithoutViews : function() {
        return this.collection.filter(function(model) {
            return !this.modelViews[model.id]
        }, this);
    },

    createModelView : function(model) {
        this.modelViews[model.id] = this.modelViews[model.id] || new this.modelViewClass({
            model : model,
            rootUrl : this.rootUrl
        });
        this.modelViews[model.id].render();
        return this.modelViews[model.id];
    },

    createMissingModelViews : function(model, collection) {
        _.each(this.getModelsWithoutViews(), this.createModelView, this);
    },

    reorganizeModelViews : function() {

        for(var i = 0; i < this.collection.length; i++) {


            var model = this.collection.at(i);
            var modelView = this.modelViews[model.id] || this.createModelView(model);

            var uiIndex = this.$list.children().index(modelView.$el);

            if (i != uiIndex) {
                if (uiIndex > -1) {
                    modelView.$el.detach()
                }
            } else {
                // this model is in place
                continue;
            }

            var squatter = this.$list.children().eq(i);

            //if (squatter.length == 0) {
            if (squatter.length == 0) {
                this.$list.append(modelView.$el);
            } else {
                $(squatter, this.$list).before(modelView.$el);
            }
        }
    },

    render : function() {

        _.keys(this.modelViews, function(mid) {
            this.modelViews[mid].close();
            delete this.modelViews[mid];
        });

        if (this.getModelsWithoutViews().length > 0){
            this.createMissingModelViews();
            this.reorganizeModelViews();
        }

        if (this.$el.has(this.$list).length == 0) {

            var renderOptions = this.options.renderOptions || {};

            _.extend(renderOptions, {
                // FIXME: should be dynamically rendered
                moreAvailable : (this.collection.length > 0) && (this.model.total > this.collection.length),
                size : this.model.total
            });

            var renderedPack = $(this.options.template(renderOptions));
            renderedPack.find(".content").html(this.$list);
            this.$el.html(renderedPack);
            console.info("packview for " + this.model.get("name") + " attached to element");
        }

        return this.$el;
    },
});



Curie.Views.Pack = Curie.Views.CollectionGeneric.extend({
    events : {
        "click .loadMore button" : "loadNextPage"
    },
    initialize : function(options) {
        options = options || {};
        _.extend(options, {
            modelViewClass : WrappedRowView,
            template : Handlebars.templates.pack,
            rootUrl : this.options.rootUrl || window.curie.router.reverse('showPack', { pack : this.model.get("name") }),
        });
        Curie.Views.CollectionGeneric.prototype.initialize.apply(this, [options]);
    },
    loadNextPage : function() {
        console.info("Loading next page");
        this.model.nextPage();
    }
});


Curie.Views.SearchResults = Curie.Views.Pack.extend({
    initialize : function(options) {
        options = options || {};
        var query = this.model.get("query");
        _.extend(options, {
            rootUrl : 'search/' + utf8_to_b64(query),
            renderOptions : {
                query : query
            }
        });
        Curie.Views.Pack.prototype.initialize.apply(this, [options]);
    },
});
