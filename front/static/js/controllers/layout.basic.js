Curie.Controllers.Layout.Basic = function () {

    var appView = new AppView();
    var loginView = new LoginModalView();

    var packListViews = [];

    appView.render();

    var popupView = new PopupView({ el : appView.$("#popupView")});
    var sidebarView = new SidebarView({ el : appView.$("#sidebarView")});
    sidebarView.render();

    var renderPackListView = function(collection) {
        var newView = new PackListView({ collection: collection });
        packListViews.push(newView);
        newView.render();
        sidebarView.addPackListView(newView);
    }

    var showPopup = function(objType, objId) {

        var objClass = null;
        var viewClass = null;

        if (objType == "message") {
            objClass = Message;
            viewClass = MessageView;
        } else if (objType == "thread") {
            objClass = Thread;
            viewClass = ThreadView;
        } else {
            console.error("Unknown obj type. Can't show a popup with", objType, objId);
            return;
        }

        var obj = curie.cache.add(objClass, { id : objId });
        var subview = new viewClass({ model : obj })
        obj.fetch({
            success : function() {
                popupView.hide().render(subview);
            }
        });
    }

    var updateTitle = function(pack, unread) {
        if (pack) {
            unread = unread || pack.get("unread");
            document.title = pack.get("name") + ((unread && unread > 0) ? " (" + unread +")" : "") + " - Curie";
        } else {
            document.title = "Curie";
        }
    }

    curie.state.on({

        "search:show" : appView.showSearch,
        "search:hide" : appView.hideSearch,
        "hotkey:esc" : appView.hideSearch,

        "navigate:activePack" : popupView.hide,
        "draft:new" : sidebarView.toggleDraftLink,

        "connection:established" : sidebarView.hideAlert,
        "connection:error" : sidebarView.showAlert,

        "fetch:done" : sidebarView.updateLastFetchTime,

        "login:fail" : loginView.shake,
        "login:show" : loginView.show,

        "change:activePack" : function(state, pack) {
            console.info("active pack is", pack);
            updateTitle(pack);
            _.each(packListViews, function(view) {
                view.updateActive(pack);
            });
        },
        "change:selectedPack" : function(state, pack) {
            _.values(packListViews).each(function(view) {
                view.updateSelected(pack);
            });
        },
    });

    curie.state.account.on("change", sidebarView.updateAccountInfo);

    curie.state.on("login:success", appView.showMainBlock);
    curie.state.on("login:success", loginView.hide);

    curie.state.on("hotkey:esc", appView.hideSearch);
    curie.state.on("hotkey:esc", function() {
        if (popupView.$el.is(":visible")) {
            curie.state.trigger("navigate:activePack");
        }
    });

    //FIXME
    //stateModel.on("message:show:type", this.changeBodyTypeHotkey, this);


    _.extend(this, {
        showPopup : showPopup,
        renderPackListView : renderPackListView,
    });
}
