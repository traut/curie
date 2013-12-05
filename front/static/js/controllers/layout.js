Curie.Controllers.Layout = function () {

    var basic = new Curie.Controllers.Layout.Basic();
    var pack = new Curie.Controllers.Layout.Pack();
    var search = new Curie.Controllers.Layout.Search();
    var contacts = new Curie.Controllers.Layout.Contacts();

    _.extend(this, {
        renderPackListView : basic.renderPackListView,
        //renderPackView : pack.renderPackView,
        createPackView : pack.createPackView,
        renderViewAsPack : pack.renderViewAsPack,

        showMessage : _.partial(basic.showPopup, Curie.Models.Message),
        showThread : _.partial(basic.showPopup, Curie.Models.Thread),
        showDraft : _.partial(basic.showPopup, Curie.Models.Draft),

        showFilters : function() {
            var filters = new Curie.Models.Filters();

            filters.fetch({
                success : function() {
                    var view = new Curie.Views.FiltersView({collection : filters});
                    view.render();
                    pack.renderViewAsPack(view);
                }
            });

            curie.state.set({"activePack": null}, {silent : true});
            curie.state.set("localHotkeysKeyListener", null);
        },

        showSearchResults : function(query) {
            var results = curie.controllers.data.getSearchResults(query);
            results.fetch({
                update: true,
                success : function() {
                    curie.state.set("activePack", results);
                }
            });
        },

        updateTitle : basic.updateTitle
    });
};
