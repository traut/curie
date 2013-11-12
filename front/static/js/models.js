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
}, { typeName : "MessageLight" });

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
        this.on("destroy", this.unbind, this);
    },
    unbind : function() {
    }
}, { typeName : "Message" });


var Draft = Message.extend({
    urlRoot: "/drafts",
    initialize: function() {
        this.changedByUser = false;
    }
}, { typeName : "Draft" });



var Messages = Backbone.Collection.extend({
    model : MessageLight,
    comparator : function(message) {
        return -message.get("received"); // newest goes first
    },
    parse : function(docs, options) {
        var newMessages = docs.map(function(m) {
            //FIXME: what if this is a thread?
            return curie.cache.add(MessageLight, m);
        });
        if (options.extend) {
            return _.union(this.models, newMessages);
        } else {
            return newMessages;
        }
    },
    
}, { typeName : "Messages" });


var Thread = Backbone.Model.extend({
    defaults: {
        id : null,

        received : null,
        unreadCount : null,

        labels : [],
        messages : []
    },
    urlRoot: "/threads",
    parse : function(resp, options) {
        var messages = resp.messages.map(function(m) {
            return initEntity("Message", Message, m);
        });
        resp.messages = messages;
        return resp;
    },
}, { typeName : "Thread" });

Curie.Models.PagedMessagesWrapper = Backbone.Model.extend({
    page : 0,
    total : 0,
    initialize : function() {
        this.messages = new Messages();
    },
    fetchMessages : function() {
        return this.fetch({update : true});
    },
    fetch : function(options) {
        _.extend(this.ctx, {
            page : this.page
        });
        return Backbone.Model.prototype.fetch.call(this, options);
    },
    nextPage : function() {
        this.page += 1;
        return this.fetchMessages();
    },
    parseMessages : function(docs) {
        return docs.map(function(m) {
            //FIXME: what if this is a thread?
            return curie.cache.add(MessageLight, m);
        });
    },
    parse : function(response) {
        console.error("Received", response);
        this.messages.add(this.parseMessages(response.docs));
        this.page = response.page;
        this.total = response.total;
        return response;
    }
});


var Pack = Curie.Models.PagedMessagesWrapper.extend({
    defaults : {
        id : null,
        name : null,
        size : null,
        unread : null,
    },
    initialize : function() {
        Curie.Models.PagedMessagesWrapper.prototype.initialize.apply(this, arguments);
        this.messages.url = '/packs/' + this.get("name") + '/messages';
        this.total = this.get("size");
    },
    fetchMessages : function() {
        this.messages.ctx = {
            page : this.page
        };
        return this.messages.fetch({update : true, extend : true});
    },
}, { typeName : "Pack" });


var SearchResults = Curie.Models.PagedMessagesWrapper.extend({
    url : "/search",
    defaults : {
        id : null,
        query : null,
        size : 0,
        unread : null,
        name : "search",
    },
    initialize: function() {
        Curie.Models.PagedMessagesWrapper.prototype.initialize.apply(this, arguments);

        var SEARCH_FIELDS = ["subject", "from.name", "body"];

        var query = this.get("query");
        if (query == null) {
            throw new Exception("No query provided");
        };
        if (query[0] == "+") {
            query = query.substring(1);
        } else {
            var extendedQuery = _.map(SEARCH_FIELDS, function(f) {
                return '' + f + ':"' + query + '"';
            }).join(" OR ");
            query = "+(" + extendedQuery + ")";
        }

        this.ctx = { query : query };
        this.queryHash = utf8_to_b64(query);
        this.set("name", this.getName());
    },

    getName : function(query) {
        return 'Search for "' + (query || this.get("query")) + '"';
    },

}, { typeName : "SearchResults" });


var Packs = Backbone.Collection.extend({
    model: Pack,
    parse : function(resp, options) {
        return resp.map(function(m) {
            return curie.cache.add(Pack, m);
        });
    },
});

var Searches = Backbone.Collection.extend({
    model: SearchResults,
});

Curie.Models.Account = Backbone.Model.extend({
    defaults: {
        email : null,
        name : null
    },
    urlRoot: "/account",
});

Curie.Models.State = Backbone.Model.extend({
    defaults: {
        activePack : null,
        selectedPack : null,
    },
    account : new Curie.Models.Account(),
    markedMessages : new Messages(),

    setPackByName : function(packName) {
        var activePack = (packName == null) ? null : curie.cache.getByProperty(Pack, "name", packName);
        curie.state.set("activePack", activePack);
    }
    
});
