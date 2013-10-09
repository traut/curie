var Draft = Backbone.Model.extend({
    defaults: {
        id : null,

        from : [], // should be a proper EmailAddress object
        to : [],
        cc : [],
        bcc : [],

        subject : '',
        body : '',
        in_reply_to : '',

        // dates
        created : null,
        saved : null,

        attachments : []
    },
    urlRoot : "/draft",

    initialize: function() {
        this.changedByUser = false;
    }
});

var MessageLight = Backbone.Model.extend({
    defaults: {
        id : null,

        from : null,
        to : null,
        cc : null,
        bcc : null,

        subject : null,

        received : null,
        unread : null,
        labels : [],
        
        thread : null,
        messages : [],
    },
    initialize: function() {
    },
    getLatestMessage : function() {
        if (this.get("thread")) {
            var messages = this.get("messages");
            return messages[0];
        }
    }
});

var Message = Backbone.Model.extend({
    defaults: {
        id : null,

        from : null,
        to : null,
        cc : null,
        bcc : null,

        subject : null,

        received : null,
        unread : null,
        labels : [],

        body : null,

        attachments : []
    },
    urlRoot: "/messages",
});

var Messages = Backbone.Collection.extend({
    model : MessageLight,
    getUnreadCount : function() {
        return this.where({unread : true}).length;
    },
    comparator : function(message) {
        return - message.get("received"); // newest goes first
    },
    parse : function(resp, options) {
        var models = resp.map(function(m) {
            return initEntity("MessageLight", MessageLight, m);
        });
        return models;
    },
});

var Thread = Backbone.Model.extend({
    defaults: {
        id : null,

        received : null,
        unreadCount : null,

        labels : [],
        messages : []
    },
    urlRoot: "/threads",
});


var GroupPreview = Backbone.Model.extend({
    defaults : {
        id : null,
        groupBy : null,
        value : null,
        size : null,
        unread : null,
        pack : null,
        messages : null,
    },
    initialize: function() {
        this.url = "/packs/" + this.get("pack") + "/groups/" + this.get("groupBy") + "/" + this.get("value") + "/light";
    },
    parse : function(response, options) {
        response.messages = new Messages(response.topMessages);
        return response;
    }
});

var SearchResults = Backbone.Model.extend({
    url : "/search",
    defaults : {
        id : null,
        query : null,
        size : null,
        unread : null,
        name : "search",
    },
    initialize: function() {
        this.messages = new Messages();
        this.groups = new Groups();

        this.ctx = {
            query : this.get("query")
        }
        this.set("name", this.generateName());
    },
    generateName : function(query) {
        return "search/" + utf8_to_b64(query || this.get("query")); 
    },
    parse : function(response, options) {
        this.messages.reset(response.messages);
        response.name = this.generateName(response.query);
        return response;
    },
    fetchAll : function(options) {
        this.fetch(options);
    }
});

var Groups = Backbone.Collection.extend({
    model: GroupPreview,
    initialize: function() {
    },
    comparator : function(group) {
        return - group.get("messages").at(0).get("received"); // newest goes first
    }
});

var Pack = Backbone.Model.extend({
    defaults : {
        id : null,
        name : null,
        size : null,
        unread : null,
    },
    initialize : function() {
        var packName = this.get('name');

        this.groups = new Groups();
        this.groups.url = '/packs/' + packName  + '/groups/from';

        this.messages = new Messages();
        this.messages.url = '/packs/' + packName + '/messages';

    },
    fetchAll : function(options) {
        this.groups.fetch(options);
        this.messages.fetch(options);
    },
});

var Packs = Backbone.Collection.extend({
    model: Pack,
});

var Searches = Backbone.Collection.extend({
    model: SearchResults,
});

var StateModel = Backbone.Model.extend({
    defaults: {
        activePackName : null,
        selectedPackName : null,
    },
    markedMessages : new Messages(),
});
