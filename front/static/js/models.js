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


var Group = Backbone.Model.extend({
    defaults : {
        value : null,
        size : null,
        topMessages : null,
    },
    initialize: function() {
    },
});

var Groups = Backbone.Collection.extend({
    model: Group,
    initialize: function() {
    },
    comparator : function(group) {
        return - group.get("size"); // biggest goes first
    }
});

var Pack = Backbone.Model.extend({
    defaults : {
        name : null,
        active : false,
        hashUrl : null,
        groupBy : "from",
    },
    initialize: function() {
        this.groups = new Groups();
        this.groups.url = '/packs/' + this.get('name')  + '/groups/' + this.get('groupBy');

        this.messages = new Messages();
        this.messages.url = '/packs/' + this.get('name') + '/messages';
    },
    fetchAll: function(options) {
        this.groups.fetch(options);
        this.messages.fetch(options);
    }
});

var Packs = Backbone.Collection.extend({
    model: Pack,
    url: '/packs',
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
});

