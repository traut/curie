function slugifySelector(str) {
    if (str) {
        return str.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g,'__');
    } else {
        return str;
    }
}

Handlebars.registerHelper('isOutcoming', function(message, options) {
    if (_.contains(message.labels, 'sent') || _.contains(message.labels, 'draft')) {
        return options.fn(message);
    } else {
        return options.inverse(message);
    }
});


Handlebars.registerHelper('dateformat', function(stamp, format) {
    return (stamp) ? moment(stamp).format(format) : "";
});

Handlebars.registerHelper('date_ago', function(stamp) {
    if (stamp) {
        return moment(stamp).fromNow()
    }
    return '';
});

Handlebars.registerHelper('commaJoined', function(items, options) {
    var out = '';
    for(var i=0, l=items.length; i<l; i++) {
        out = out + $.trim(options.fn(items[i])) + (i !== (l-1) ? ", " : "");
    }
    return out;
});

Handlebars.registerHelper('shortify', function(value, maxlength) {
    if (value.length > maxlength) {
        return value.slice(0, maxlength) + "...";
    }
    return value;
});

Handlebars.registerHelper('slugifySelector', function(value) {
    return slugifySelector(value);
});

Handlebars.registerHelper("last", function(array) {
    return array[array.length-1];
});

Handlebars.registerPartial("messageRow", Handlebars.templates.messageRow);
Handlebars.registerPartial("messageList", Handlebars.templates.messageList);
Handlebars.registerPartial("messageView", Handlebars.templates.message);
Handlebars.registerPartial("draftView", Handlebars.templates.draft);

Handlebars.registerPartial("emailAddress", Handlebars.templates.emailAddress);
Handlebars.registerPartial("emailAddressWithLink", Handlebars.templates.emailAddressWithLink);
