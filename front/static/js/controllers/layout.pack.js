var cv = null;
Curie.Controllers.Layout.Pack = function () {
    var currentView = null;
    var views = {};

    var createView = function(model) {

        var _view = null;
        if (model instanceof Curie.Models.SearchResults) {
            _view = new Curie.Views.SearchResults({
                model : model,
                collection : model.messages,
            });
        } else {
            _view = views[model.cid] = new Curie.Views.Pack({
                model : model,
                collection : model.messages,
            });
        };
        console.info("Pack view for '" + model.get("name") + "' created");
        _view.render();
        return _view;
    };

    var getView = function(model) {
        return views[model.cid] || createView(model);
    };

    var createPackView = function(model) {
        getView(model);
    };

    var renderPackView = function(model) {
        if (currentView && currentView.model == model) {
            console.info("pack view for the model is already active", model);
            return;
        }
        renderViewAsPack(getView(model));
    };

    var renderViewAsPack = function(view) {
        currentView && currentView.$el.detach();
        cv = currentView = view;
        console.info("adding pack view to DOM", view);
        $("#packView #contentView").html(currentView.$el);
    };

    var hidePackView = function() {
        currentView && currentView.$el.detach();
        currentView = null;
    };


    curie.state.on({
        "change:activePack" : function(model, value, options) {
            if (value) {
                renderPackView(value);
            } else {
                hidePackView();
            }
        },
        "navigate:activePack" : function() {
            curie.router.navigateToPack(curie.state.get("activePack"));
        }
    });


    var navigateToDraft = function() {
        var pack = curie.state.get("activePack");
        if (pack == null || pack == undefined) {
            pack = window.curie.controllers.data.getPackByName("inbox");
        }
        curie.router.navigateToDraftInContext(pack, '');
    }


    _.extend(this, {
        //renderPackView : renderPackView,
        createPackView : createPackView,
        renderViewAsPack : renderViewAsPack
    });

}

