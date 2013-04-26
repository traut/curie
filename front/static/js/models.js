var MessagePreview = Backbone.Model.extend({
    defaults: {
        id : null,
        to_name : null,
        to_email : null,
        from_name : null,
        from_email : null,
        subject : null,
        unread : null,
        received : null,
        labels : []
    },
});

var MessageFull = Backbone.Model.extend({
    defaults: {
        id : null,
        to_name : null,
        to_email : null,
        from_name : null,
        from_email : null,
        subject : null,
        unread : null,
        received : null,
        labels : [],
        body : null
    },
    urlRoot: "/messages"
});

var Messages = Backbone.Collection.extend({
    model : MessagePreview,
    getUnreadCount : function() {
        return this.where({unread : true}).length;
    },
    comparator : function(message) {
        return - message.get("received"); // newest goes first
    }
});

var Pack = Backbone.Model.extend({
    defaults : {
        name : '',
        active : false,
        hashUrl : null
    },
    initialize: function() {
        this.messages = new Messages();
        var name = this.get('name');
        this.messages.url = function() {
            return '/pack/' + name  + '/messages';
        }
    },

});

var Packs = Backbone.Collection.extend({
    model: Pack,
    getActive : function() {
        return this.findWhere({active : true});
    },
    activate : function(packName) {
        var requestedPack = this.findWhere({name : packName});
        if (!requestedPack.get("active")) {
            console.info("making " + packName + " active");
            var active = this.getActive();
            if (active) {
                active.set("active", false);
            }
            requestedPack.set("active", true);
        }
    },
    renderEvent : function(packName) {
        this.findWhere({name : packName}).trigger("render");
    }
});

