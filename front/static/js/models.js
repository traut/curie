var Message = Backbone.Model.extend({
    defaults: {
        id : null,
        to_name : null,
        to_email : null,
        from_name : null,
        from_email : null,
        subject : null,
        unread : true,
        labels : []
    },
    urlRoot: "/messages"
});

var Messages = Backbone.Collection.extend({
    model : Message,
    getUnreadCount : function() {
        return this.where({unread : true}).length;
    },
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
    activateOne : function(packName) {
        var active = this.getActive();
        if (active) {
            active.set("active", false);
        }
        this.findWhere({name : packName}).set("active", true);
    }
});

