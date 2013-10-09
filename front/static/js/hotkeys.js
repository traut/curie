var dummy = function() {};

var hotkeys = {
    packActions : {
        't j' : {
            doc : 'Choose a pack below',
            action : function() {
                stateModel.trigger("selectPack", "below");
            }
        },
        't k' : {
            doc : 'Choose a pack above',
            action : function() {
                stateModel.trigger("selectPack", "above");
            }
        },
        /*
        't l' : {
            doc : 'Show choosed pack',
            action : function() {
                stateModel.trigger("activateSelectedPack");
            }
        },
        */
        'v t' : {
            doc : 'Show current pack as tiles',
            action : function() {
                stateModel.trigger("showPackAs", "tiles");
            }
        },
        'v l' : {
            doc : 'Show current pack as list',
            action : function() {
                stateModel.trigger("showPackAs", "list");
            }
        },
        'v c' : {
            doc : 'Show current pack as combined view',
            action : function() {
                stateModel.trigger("showPackAs", "combined");
            }
        },
    },
    messageActions : {
        'j' : {
            doc : 'Choose a message/group below',
            action : function() {
                stateModel.get("activeArrowsListener").trigger("move", "j");
            }
        },
        'k' : {
            doc : 'Choose a message/group above',
            action : function() {
                stateModel.get("activeArrowsListener").trigger("move", "k");
            }
        },
        'l' : {
            doc : 'Show/hide selected message/group',
            action : function () {
                stateModel.get("activeArrowsListener").trigger("move", "l");
            }
        },
        'x' : {
            doc : 'Mark/unmark a message/group as selected',
            action : function() {
                stateModel.get("activeArrowsListener").trigger("action", "x");
            }
        },
        'g g' : {
            doc : 'Choose the latest message',
            action : function() {
                stateModel.get("activeArrowsListener").trigger("move", "gg");
            }
        },
        'G' : {
            doc : 'Choose the earliest message',
            action : function() {
                stateModel.get("activeArrowsListener").trigger("move", "G");
            }
        },
        'm n' : {
            doc : 'Create a new message',
            action : function(e) {
                e.preventDefault();
                window.curie.controller.routeToNew();
            }
        },
        'm u' : {
            doc : 'Mark a message as unread',
            action : dummy
        },
        'm l' : {
            doc : 'Add a label',
            action : dummy
        },
    },
    globalActions : {
        '/' : {
            doc : 'Activate search',
            action : function(e) {
                e.preventDefault();
                stateModel.trigger("showSearch");
            }
        },
        '?' : {
            doc : 'Show hotkeys description',
            action : showHotkeysHelp
        },
        'q q' : {
            doc : 'Logout',
            action : function(e) {
                e.preventDefault();
                stateModel.trigger("logout");
            }
        },
        'esc' : {
            doc : 'Go one level up',
            action : function() {
                stateModel.trigger("escPressed");
            }
        },
    }
};

_.each(hotkeys, function(keys, actionType) {
    _.each(keys, function(value, hotkey) {
        Mousetrap.bind(hotkey, function(e, combo) {
            console.info("Hotkey '" + combo + "' pressed");
            value.action(e);
        });
    });
});

function showHotkeysHelp() {
    var tmpl = Handlebars.templates.hotkeysModal;

    var tmplData = [];
    _.each(hotkeys, function(keys, actionType) {
        var actionTypeData = [];
        _.each(keys, function(value, hotkey) {
            actionTypeData.push({
                hotkey : hotkey,
                doc : value.doc,
            })
        });
        tmplData.push(actionTypeData);
    });
    $("#hotkeysModal").html(tmpl({actionTypes : tmplData})).modal({
        keyboard : true
    });
}
