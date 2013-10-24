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
        to : [],
        cc : [],
        bcc : [],

        in_reply_to_mid : null,

        subject : '',

        received : null,
        unread : null,
        labels : [],

        body : [],

        attachments : []
    },
    urlRoot: "/messages",
    initialize : function() {
        stateModel.on("fetch:message:" + this.get("id"), this.fetch, this);
        this.on("destroy", this.unbind, this);
    },
    unbind : function() {
        stateModel.off("fetch:message:" + this.get("id"), this.fetch);
    }
});


var Draft = Message.extend({
    urlRoot: "/drafts",
    initialize: function() {
        this.changedByUser = false;
    }
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

        var name = this.generateName();
        this.set("name", name);

        stateModel.on("fetch:pack:" + name, function() {
            console.info("fetch:pack:" + name  + " received");
            this.fetchAll();
        }, this);
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
        options = options || {};
        options.success = function(collection) {
            collection.sort();
        }

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

        stateModel.on("fetch:pack:" + packName, function() {
            console.info("fetch:pack:" + packName + " received");
            this.fetchAll();
        }, this);

    },
    fetchAll : function(options) {
        console.info("fetch all " + this.get("name"));

        options = options || {};
        options.success = function(collection) {
            collection.sort();
        }

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
