var util = require('util'),
    barista = require('barista'),
    solrLib = require('solr'),
    winston = require('winston'),
    isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs'),
    cookie = require('cookie'),
    cookie_signature = require('cookie-signature'),
    async = require('async');

var settings = require('./settings');

var solr = solrLib.createClient();
var solrEscape = solrLib.valueEscape

function accessControlQueryPart(email) {
    var query = " +(";
    for(i in settings.MAIL_ACCESS_MAP[email]) {
        query += ' to.email:"' + solrEscape(settings.MAIL_ACCESS_MAP[email][i]) + '"';
    }
    query += ") ";
    return query;
}


function createMessageId(internalId) {
    return util.format("<%s@%s>", internalId, settings.DOMAIN);
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

function flatToDict(flatMap) {
    var result = {};
    if (!flatMap) {
        return result;
    }
    for (var i = 0; i < flatMap.length; i++) {
        if (i % 2 == 0) {
            result[flatMap[i]] = flatMap[i + 1];
        }
    };
    return result;
}

 
// creates the event to push to listening clients
var eventSignature = function (operation, cast) {
    var signature = operation + ':' + cast.url;
    if (cast.ctx) signature += (':' + cast.ctx);
    return signature;
}; 

function messageParsedPath(messageId) {
    return settings.STORAGE_PATH + messageId.substring(0, 2) + "/" + messageId.substring(2, 4) + "/" + messageId.substring(4, 6) + "/" + messageId + ".json";
}

function draftPath(userEmail, draftId) {
    var hashedMail = crypto.createHash('md5').update(key).digest("hex");
    return settings.DRAFTS_PATH + hashedMail.substring(0, 2) + "/" + hashedMail.substring(2, 4) + "/" + hashedMail.substring(4, 6) + "/" + hashedMail + "/" + draftId + ".json";
}

function pad(n) {
    return n < 10 ? ('0' + n) : n;
}


var fileTransport = new (winston.transports.File)({
    filename: settings.LOG_FILE,
    json: 'false'
});


function createCookie(name, val, options){
    options = util.merge({}, options);

    if ('number' == typeof val) val = val.toString();
    if ('object' == typeof val) val = 'j:' + JSON.stringify(val);

    val = 's:' + cookie_signature.sign(val, settings.SECRET);

    if ('maxAge' in options) {
        options.expires = new Date(Date.now() + options.maxAge);
        options.maxAge /= 1000;
    }
    if (null == options.path) options.path = '/';

    return cookie.serialize(name, String(val), options);
};


function getLogger(name) {
    var consoleTransport = new (winston.transports.Console)({
        colorize: 'true',
        label: name,
        timestamp: function() {
            var d = new Date();
            return util.format("%s:%s:%s.%s", pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds()), pad(d.getMilliseconds()));
        }
    });
    return new (winston.Logger)({
        transports: [consoleTransport, fileTransport]
    });
}

 
module.exports = {
    solr : solr,
    solrEscape : solrEscape,

    accessControl : accessControlQueryPart,
    flatToDict : flatToDict,

    getLogger : getLogger,

    messageParsedPath : messageParsedPath,
    draftPath : draftPath,
    eventSignature : eventSignature
}
