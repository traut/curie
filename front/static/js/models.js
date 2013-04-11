var Message = Backbone.Model.extend({
    defaults: {
        id : 'someDefaultMailID',
        to_name : 'default to name',
        to_email : 'default to email',
        from_name : 'default from',        
        from_email : 'default from',        
        subject : 'default subject',
        unread : true,
        labels : []
    },
});

var Messages = Backbone.Collection.extend({
    model : Message,
    getUnread : function() {
        return this.filter(function(message) {
            return !message.get('read');
        });
    },
});

var Pack = Backbone.Model.extend({
    initialize: function(packName) {
        this.set('name', packName);

        this.messages = new Messages();
        this.messages.url = '/pack/' + this.get('name')  + '/messages';
    },
});

