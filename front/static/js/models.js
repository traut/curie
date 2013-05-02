var Draft = Backbone.Model.extend({
    defaults: {
        id : null,
        to_name : null,
        to_email : null,
        from_name : null,
        from_email : null,
        subject : null,
        body : null,
        created : null,
        saved : null
    },
});

var Drafts = Backbone.Collection.extend({
    model : Draft,
    comparator : function(draft) {
        return - draft.get("saved"); // newest goes first
    }
});


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


var GroupPreview = Backbone.Model.extend({
    defaults : {
        id : null,
        groupBy : null,
        value : null,
        size : null,
        unread : null,
        pack : null,
        topMessages : new Messages(),
    },
    initialize: function() {
        this.url = "/packs/" + this.get("pack") + "/groups/" + this.get("groupBy") + "/" + this.get("value") + "/light";
    },
    parse : function(response, options) {
        response.topMessages = new Messages(response.topMessages);
        return response;
    }
});

var SimpleSearchResults = Backbone.Model.extend({
    defaults : {
        id : null,
        searchField : null,
        searchValue : null,
        size : null,
        unread : null,
        pack : null,
        messages : new Messages(),
    },
    messages : new Messages(), // dummy
    initialize: function() {
        this.url = "/packs/" + this.get("pack") + "/search/" + this.get("searchField") + "/" + this.get("searchValue");
    },
    parse : function(response, options) {
        response.messages = new Messages(response.messages);
        this.messages = response.messages;
        return response;
    },
});

var Groups = Backbone.Collection.extend({
    model: GroupPreview,
    initialize: function() {
    },
    comparator : function(group) {
        return - group.get("size"); // biggest goes first
    }
});

var Pack = Backbone.Model.extend({
    defaults : {
        name : null,
        selected : false,
        hashUrl : null,
        groupBy : "from",

        active : false,
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

