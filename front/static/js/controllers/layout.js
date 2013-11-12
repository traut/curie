Curie.Controllers.Layout = function () {

    var basic = new Curie.Controllers.Layout.Basic();
    var pack = new Curie.Controllers.Layout.Pack();
    var search = new Curie.Controllers.Layout.Search();

    _.extend(this, {
        renderPackListView : basic.renderPackListView,
        //renderPackView : pack.renderPackView,
        createPackView : pack.createPackView,
        renderAsPack : pack.renderAsPack,
        showMessage : _.partial(basic.showPopup, "message"),

        showSearchResults : function(query) {
            var results = curie.controllers.data.getSearchResults(query);
            results.fetch({
                update: true,
                success : function() {
                    curie.state.set("activePack", results);
                }
            });
        }
    });
};
