var dummy = function() {};

var hotkeys = {
    "Global" : {
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
        'esc' : {
            doc : 'Go one level up',
            action : function() {
                curie.state.trigger("hotkey:esc");
            }
        },
        'q q' : {
            doc : 'Logout',
            action : function(e) {
                e.preventDefault();
                curie.state.trigger("logout");
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
    "List of messages" : {
        'j' : {
            doc : 'Select a message below',
            action : function() {
                curie.state.get("localHotkeysKeyListener").trigger("move", "down");
            }
        },
        'k' : {
            doc : 'Select a message above',
            action : function() {
                curie.state.get("localHotkeysKeyListener").trigger("move", "up");
            }
        },
        'o' : {
            doc : 'Open message',
            action : function () {
                curie.state.get("localHotkeysKeyListener").trigger("action", "open");
            }
        },
        'x' : {
            doc : 'Mark/unmark a message',
            action : function() {
                curie.state.get("localHotkeysKeyListener").trigger("action", "mark");
            }
        },
        'D D' : {
            doc : 'Delete marked messages forever',
            action : function() {
                curie.state.get("localHotkeysKeyListener").trigger("action", "delete forever");
            }
        },
        'g g' : {
            doc : 'Select the latest message',
            action : function() {
                curie.state.get("localHotkeysKeyListener").trigger("move", "first");
            }
        },
        'G' : {
            doc : 'Select the earliest message',
            action : function() {
                curie.state.get("localHotkeysKeyListener").trigger("move", "last");
            }
        },
    },
    "Message" : {
        'm n' : {
            doc : 'Create a new message',
            action : function(e) {
                e.preventDefault();
                curie.controllers.layout.showDraft();
            }
        },
        /*
        'm u' : {
            doc : 'Mark a message as unread',
            action : dummy
        },
        'm l' : {
            doc : 'Add a label',
            action : dummy
        },
        */
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
        tmplData.push({ name : actionType, actions : actionTypeData});
    });
    $("#hotkeysModal").html(tmpl({actionGroups : tmplData})).modal({
        keyboard : true
    });
}
