var Message = Backbone.Model.extend({
    defaults: {
        id : 'someDefaultMailID',
        to : 'default to',
        from : 'default from',        
        subject : 'default subject'
    }
});

var Messages = Backbone.Collection.extend({
    model : Message,

    getUnread : function() {
        return this.filter(function(message) {
            return message.get('status') == 'unread';
        });
    }
});

var Pack = Backbone.Model.extend({
    initialize: function(packName) {
        this.set('name', packName);

        this.messages = new Messages();
        this.messages.url = '/pack/' + this.get('name')  + '/messages';
    }
});

