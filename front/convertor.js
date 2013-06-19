    JaySchema = require('jayschema'),
    utils = require('./utils'),

var log = utils.getLogger("convert");

var jay = new JaySchema();
var messageSchema = require('../back/schemas/message.json');

var LABELS = {
    DRAFT : "draft",
    INBOX : "inbox",
}

function EmailAddress(email, name) {
    return {
        email : email,
        name : name || null
    }
}

function assembleEmailPreview(doc) {
    console.info(doc);
    return {
        id : get_first(doc.id),  //FIXME do we really need get_first here?

        from : JSON.parse(doc.from_json),
        to : JSON.parse(doc.to_json),
        cc : JSON.parse(doc.cc_json),
        bcc : JSON.parse(doc.bcc_json),

        subject : get_first(doc.subject),

        received : isodate(get_first(doc.received)).getTime(),
        unread : get_first(doc.unread),
        labels : as_list(doc.labels),
    }
}

function assembleEmail(json, doc) {
    return {
        id : json.id,

        from : json.from,
        to : json.to,
        cc : json.cc,
        bcc : json.bcc,

        subject : json.raw['Subject'],
        body : json.raw['Body'],

        received : isodate(json.received).getTime(),
        unread : get_first(doc.unread),
        labels : as_list(doc.labels),
    }
}

function assembleDraft(json, doc) {
    return {
        id : doc.id,

        form : json.from,
        to : json.to,
        cc : json.cc,
        bcc : json.bcc,

        subject : json.raw['Subject'],
        body : json.raw['Body'],
        in_reply_to : json.raw['In-Reply-To'],

        unread : get_first(doc.unread),
        labels : as_list(doc.labels),

        created : isodate(get_first(doc.received)).getTime(),
        saved : isodate(get_first(doc.indexed)).getTime(),
    }
}




function draftToJson(draft, callback) {
    var draftMessage = {
        id : draft.id,

        raw : {
            'Message-ID' : createMessageId(draft.id),
            'From' : emailAddressesAsHeader(draft.from),
            'To' : emailAddressesAsHeader(draft.to),

            'In-Reply-To' : draft.in_reply_to,

            'Cc' : emailAddressesAsHeader(draft.cc),
            'Bcc' : emailAddressesAsHeader(draft.bcc),

            'References' : draft.in_reply_to,
            'Subject' : draft.subject,

            'Body' : draft.body
        },

        labels : draft.labels,

        from : draft.from,
        to : draft.to,
        cc : draft.cc,
        bcc : draft.bcc,

        received: draft.created
    }
    var errors = jay.validate(draftMessage, messageSchema);
    if (errors.length != 0) {
        log.error("Draft message is not valid", errors, {});
        return;
    }
    return draftMessage;
}

function draftToDoc(draft) {

    if (!draft.labels) {
        draft.labels = [LABELS.DRAFT];
    }

    if (draft.labels.indexOf(LABELS.DRAFT) == -1) {
        draft.labels.push(LABELS.DRAFT);
    }

    if (draft.in_reply_to) {
        //FIXME: calculate a proper thread_count
    }
    draft.thread_count = 0;

    var doc = {
        "id" : doc.id,

        "received" : doc.created,

        "message_id" : null,
        "in_reply_to" : draft.in_reply_to,

        "from.email" : draft.from.map(function(a) { return a.email; }),
        "from.name" : draft.from.map(function(a) { return a.name; }),
        "from.json" : JSON.stringify(draft.from),

        "to.email" : draft.to.map(function(a) { return a.email; }),
        "to.name" : draft.to.map(function(a) { return a.name; }),
        "to.json" : JSON.stringify(draft.to),

        "cc.email" : draft.cc.map(function(a) { return a.email; }),
        "cc.name" : draft.cc.map(function(a) { return a.name; }),
        "cc.json" : JSON.stringify(draft.cc),

        "bcc.email" : draft.bcc.map(function(a) { return a.email; }),
        "bcc.name" : draft.bcc.map(function(a) { return a.name; }),
        "bcc.json" : JSON.stringify(draft.bcc),

        "attachment" : draft.attachment,

        "subject" : draft.subject,
        "body" : draft.body,

        "labels" : draft.labels,
        "unread" : false,

        "thread_count" : draft.thread_count,

        "_version_" : 0, // We don't care if document exists or not. Overwrite it
    }
    return doc;
}

function emailAddressAsHeader(address) {
    if (!address || (!address.name && !address.email)) {
        return '';
    }
    return (!address.name) ? address.email : util.format("%s <%s>", address.name, address.email);
}

function emailAddressesAsHeader(addresses) {
    return addresses.map(emailAddressAsHeader(addresses)).join(",");
}
