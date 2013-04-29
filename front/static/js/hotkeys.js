var dummy = function() {};

var hotkeys = {
    packActions : {
        't j' : {
            doc : 'Choose a pack below',
            action : function() {
                window.curie.appView.selectBelowPack();
            }
        },
        't k' : {
            doc : 'Choose a pack above',
            action : function() {
                window.curie.appView.selectAbovePack();
            }
        },
        't l' : {
            doc : 'Show choosed pack',
            action : function() {
                window.curie.appView.showSelectedPack();
            }
        },
        'v t' : {
            doc : 'Show current pack as tiles',
            action : function() {
                window.curie.appView.showAs('tiles');
            }
        },
        'v l' : {
            doc : 'Show current pack as list',
            action : function() {
                window.curie.appView.showAs('list');
            }
        },
        'v c' : {
            doc : 'Show current pack as combined view',
            action : function() {
                window.curie.appView.showAs('combined');
            }
        },
    },
    messageActions : {
        'j' : {
            doc : 'Choose a message/group below',
            action : dummy
        },
        'k' : {
            doc : 'Choose a message/group above',
            action : dummy
        },
        'l' : {
            doc : 'Show selected message/group',
            action : dummy
        },
        'x' : {
            doc : 'Mark a message/group as selected',
            action : dummy
        },
        'm n' : {
            doc : 'Create a new message',
            action : dummy
        },
        'm u' : {
            doc : 'Mark a message as unread',
            action : dummy
        },
        'm p' : {
            doc : 'Change message packs',
            action : dummy
        },
    },
    globalActions : {
        '/' : {
            doc : 'Activate search',
            action : dummy
        },
        '?' : {
            doc : 'Show hotkeys description',
            action : function() {
                showHotkeysHelp();
            }
        },
    }
};

_.each(hotkeys, function(keys, actionType) {
    _.each(keys, function(value, hotkey) {
        Mousetrap.bind(hotkey, function(e, combo) {
            console.info("Hotkey '" + combo + "' pressed");
            value.action();
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
