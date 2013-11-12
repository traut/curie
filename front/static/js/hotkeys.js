var dummy = function() {};

var hotkeys = {
    packActions : {
        't j' : {
            doc : 'Choose a pack below',
            action : function() {
                curie.state.trigger("hotkey:packList", "down");
            }
        },
        't k' : {
            doc : 'Choose a pack above',
            action : function() {
                curie.state.trigger("hotkey:packList", "up");
            }
        },
        /*
        't l' : {
            doc : 'Show choosed pack',
            action : function() {
                curie.state.trigger("activateSelectedPack");
            }
        },
        'v t' : {
            doc : 'Show current pack as tiles',
            action : function() {
                curie.state.trigger("showPackAs", "tiles");
            }
        },
        'v l' : {
            doc : 'Show current pack as list',
            action : function() {
                curie.state.trigger("showPackAs", "list");
            }
        },
        'v c' : {
            doc : 'Show current pack as combined view',
            action : function() {
                curie.state.trigger("showPackAs", "combined");
            }
        },
        */
    },
    messageActions : {
        'j' : {
            doc : 'Choose a message/group below',
            action : function() {
                curie.state.get("activeArrowsListener").trigger("move", "j");
            }
        },
        'k' : {
            doc : 'Choose a message/group above',
            action : function() {
                curie.state.get("activeArrowsListener").trigger("move", "k");
            }
        },
        'l' : {
            doc : 'Show/hide selected message/group',
            action : function () {
                curie.state.get("activeArrowsListener").trigger("move", "l");
            }
        },
        'x' : {
            doc : 'Mark/unmark a message/group as selected',
            action : function() {
                curie.state.get("activeArrowsListener").trigger("action", "x");
            }
        },
        'g g' : {
            doc : 'Choose the latest message',
            action : function() {
                curie.state.get("activeArrowsListener").trigger("move", "gg");
            }
        },
        'G' : {
            doc : 'Choose the earliest message',
            action : function() {
                curie.state.get("activeArrowsListener").trigger("move", "G");
            }
        },
        'm n' : {
            doc : 'Create a new message',
            action : function(e) {
                e.preventDefault();
                window.curie.controllers.layout.navigateToDraft();
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
        'm h' : {
            doc : 'Show opened message as HTML',
            action : function(e) {
                curie.state.trigger("message:show:type", "html");
            }
        },
        'm t' : {
            doc : 'Show opened message as plain text',
            action : function(e) {
                curie.state.trigger("message:show:type", "text");
            }
        },
    },
    globalActions : {
        '/' : {
            doc : 'Activate search',
            action : function(e) {
                e.preventDefault();
                curie.state.trigger("search:show");
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
                curie.state.trigger("logout");
            }
        },
        'esc' : {
            doc : 'Go one level up',
            action : function() {
                curie.state.trigger("hotkey:esc");
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
