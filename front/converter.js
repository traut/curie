var util = require('util'),
    isodate = require("isodate"),
    JaySchema = require('jayschema'),
    extend = require("xtend"),
    utils = require('./utils');

var log = utils.getLogger("convert");

var jay = new JaySchema();
var messageSchema = require('../back/schemas/message-parsed.json');

function EmailAddress(email, name) {
    return {
        email : email,
        name : name || null
    }
}

function get_first(val) {
    if (val == null) {
        return null;
    } else if ( typeof val === 'string' || typeof val === 'boolean' ) {
        return val;
    } else {
        return val[0];
    }
}

function as_list(val) {
    if (val == null) {
        return [];
    } else if ( typeof val === 'string') {
        return [val];
    } else {
        return val;
    }
}

function solrToEmailPreview(doc) {
    return {
        id : get_first(doc.id),  //FIXME do we really need get_first here?

        from : JSON.parse(doc['from.json']),
        to : JSON.parse(doc['to.json']),
        cc : JSON.parse(doc['cc.json']),
        bcc : JSON.parse(doc['bcc.json']),

        subject : get_first(doc.subject),

        received : isodate(get_first(doc.received)).getTime(),
        indexed : isodate(get_first(doc.indexed)).getTime(),

        unread : get_first(doc.unread),
        labels : as_list(doc.labels),

        threads : as_list(doc.threads || []),
    }
}

function parsedAndSolrToEmail(json, doc) {
    var basic = solrToEmailPreview(doc);
    return extend(basic, {
        body : json.fields.body,
        attachments : json.fields.attachments,
        draft : ((doc.labels || []).indexOf("draft") > -1)
    });
}

function draftToParsed(draft) {

    var draftParsed = {
        id : draft.id,

        received: draft.received.toISOString(),

        fields : {
            message_id : draft.__message_id,

            from : [draft.from],
            to : draft.to,
            cc : draft.cc || [],
            bcc : draft.bcc || [],
            
            "in-reply-to" : draft.in_reply_to || "",

            references : draft.references || [],

            subject : draft.subject,

            body : draft.body

        },
    }
    var errors = jay.validate(draftParsed, messageSchema);
    if (errors.length != 0) {
        console.error(errors);
        return null;
    }
    return draftParsed;
}

function draftToDoc(draft) {

    function pluck(list, field) {
        return list.map(function(a) { return a[field] || null; });
    }

    var doc = {
        id : draft.id,

        received: draft.received.toISOString(),
        account : draft.account,

        message_id : draft.__message_id || "",

        "from.email" : draft.from.email, //pluck(draft.from, 'email'),
        "from.name" : draft.from.name, //pluck(draft.from, 'name'),
        "from.json" : JSON.stringify(draft.from), //JSON.stringify(draft.from),

        "to.email" : pluck(draft.to, 'email'),
        "to.name" : pluck(draft.to, 'name'),
        "to.json" : JSON.stringify(draft.to),

        "cc.email" : pluck(draft.cc, 'email'),
        "cc.name" : pluck(draft.cc, 'name'),
        "cc.json" : JSON.stringify(draft.cc),

        "bcc.email" : pluck(draft.bcc, 'email'),
        "bcc.name" : pluck(draft.bcc, 'name'),
        "bcc.json" : JSON.stringify(draft.bcc),

        attachment : draft.attachments || [],

        subject : draft.subject,
        body : pluck(draft.body, 'value'),

        labels : draft.labels,
        threads : draft.threads,
        unread : false,

        _version_ : 0, // We don't care if document exists or not. Overwrite it
    }
    return doc;
}

module.exports = {
    solrToEmailPreview : solrToEmailPreview,
    parsedAndSolrToEmail : parsedAndSolrToEmail,

    draftToParsed : draftToParsed,
    draftToDoc : draftToDoc
}

