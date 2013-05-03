var Draft = Backbone.Model.extend({
    defaults: {
        id : null,
        to_name : null,
        to_email : null,
        from_name : null,
        from_email : null,
        subject : null,
        body : null,

        // dates
        created : null,
        saved : null,
        
        labels : ['drafts'],
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
        labels : [],

        // volatile
        selected : false,
        marked : false
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
        hashUrl : null,
        groupBy : "from",

        active : false,
        selected : false,

    },
    initialize : function() {
        this.groups = new Groups();
        this.groups.url = '/packs/' + this.get('name')  + '/groups/' + this.get('groupBy');

        this.messages = new Messages();
        this.messages.url = '/packs/' + this.get('name') + '/messages';

        this.activeType = "list"; // FIXME: ugly
    },
    fetchAll : function(options) {
        this.groups.fetch(options);
        this.messages.fetch(options);
    },
    propagateEvent : function(actionType) {
        if (this.activeType == "list") {
            var current = this.messages.findWhere({ selected : true });
            var currentIndex = this.messages.indexOf(current);

            var nextIndex = null;
            var markIndex = null;
            switch (actionType) {
                case "up": 
                    nextIndex = currentIndex - 1;
                    nextIndex = (nextIndex < 0) ? (this.messages.length - 1) : nextIndex;
                    break;
                case "down":
                    nextIndex = currentIndex + 1;
                    nextIndex = (nextIndex >= this.messages.length) ? 0 : nextIndex;
                    break;
                case "mark":
                    markIndex = currentIndex;
                    break;
                case "last":
                    nextIndex = this.messages.length - 1;
                    break;
                case "first":
                    nextIndex = 0;
                    break;
            }
            if (nextIndex != null) {
                this.messages.where({selected : true}).forEach(function(m) {
                    m.set('selected', false);
                });
                this.messages.at(nextIndex).set('selected', true);
            }
            if (markIndex != null) {
                var model = this.messages.at(markIndex);
                model.set('marked', !model.get("marked"));
                console.info(this.messages.at(markIndex), model.get("marked"));
            }

        }
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

