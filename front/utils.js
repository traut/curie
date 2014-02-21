var util = require('util'),
    barista = require('barista'),
    winston = require('winston'),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    mkpath = require('mkpath'),
    pathTool = require('path'),
    cookie = require('cookie'),
    cookie_signature = require('cookie-signature'),
    async = require('async'),
    beanstalk = require('nodestalker'),
    uuidLib = require('node-uuid'),
    rmdir = require('rimraf'),

    settings = require('./settings.js');

var mmm = require('mmmagic'),
    mime = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

var args = require('minimist')(process.argv.slice(2));
var LOG_FILE = args["log"] || "curie-webserver.log";


AccessDenied = function(accessedByAccount, contentType, contentId) {

    this.account = accessedByAccount;
    this.type = contentType;
    this.id = contentId;

    this.toString = function() {
        return util.format("AccessDenied(account=%s, content=%s, id=%s)", this.account, this.type, this.id);
    }

    return this;
}

function createMessageId(internalId) {
    return util.format("<%s.%s@%s>", new Date().getTime(), internalId, settings.DOMAIN);
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

function pathWith2Letters(name) {
    return name.substring(0, 2) + "/" + name.substring(2, 4) + "/" + name.substring(4, 6);
}

function messageParsedPath(messageId) {
    return settings.STORAGE.MESSAGES + pathWith2Letters(messageId) + "/" + messageId + ".parsed.json";
}

function attachmentPath(messageId, attachment) {
    return settings.STORAGE.MESSAGES + pathWith2Letters(messageId) + "/" + attachment + ".attachment";
}

function draftPath(account, draftId) {
    var hash = crypto.createHash('sha1').update(account).digest("hex");
    return settings.STORAGE.DRAFTS + pathWith2Letters(hash) + "/" + hash + "/" + draftId + ".draft.json";
}

function uniqueId() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha256').update(current_date + random).digest('hex');
}

function uuid() {
    return uuidLib.v4();
}

function pad(n) {
    return n < 10 ? ('0' + n) : n;
}


var fileTransport = new (winston.transports.File)({
    filename: LOG_FILE,
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


function writeToFile(path, data, callback, plainText) {

    if (!plainText) {
        data = JSON.stringify(data);
    }

    mkpath(pathTool.dirname(path), function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        fs.open(path, 'w', function(err, fd) {
            if (err) {
                callback(err, null);
                return;
            }

            fs.flock(fd, 'ex', function(err) {
                if (err) {
                    console.info("Can't lock a file " + path, err);
                    callback(err, null);
                    return;
                }
                fs.writeFileSync(path, data);
                fs.flock(fd, 'un');
                fs.closeSync(fd);
                callback(null, path);
            });
        });
    });
}

function readFromFile(path, callback, plainText) {

    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
              console.error("Can't read a file " + path, err);
              callback(err, null);
              return;
            }
            if (plainText) {
                callback(null, data);
            } else {
                callback(null, JSON.parse(data));
            }
        });
    } else {
        callback("Path " + path + " doesn't exists!", null);
    }
}

function deleteFile(path, callback) {
    fs.unlink(path, callback);
}

function deleteMessageDir(messageId, callback) {
    var path = messageParsedPath(messageId);

    rmdir(pathTool.dirname(path), callback);
}

function getLogger(name) {
    var consoleTransport = new (winston.transports.Console)({
        colorize: 'true',
        level: settings.LOG_LEVEL,
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

function mergeIntoThreads(messages) {

    var threads = {};
    var combined = [];

    messages.forEach(function(m) {
        if (m.threads.length > 0) {
            m.threads.forEach(function(thread) {
                if (!(thread in threads)) {
                    threads[thread] = [];
                    combined.push({
                        id : thread,
                        thread : thread,
                        messages : threads[thread],
                    });
                }
                threads[thread].push(m);
            });
        } else {
            combined.push(m);
        }
    });

    combined = combined.map(function(c) {
        if (c.thread) {

            var messages = c.messages;
            delete c.messages;

            messages.sort(function(m1, m2) {
                return (m1.received - m2.received);
            });
//            messages.map(function(m) {
//                console.info(m.id, m.received, m.subject);
//            });

            c.last = messages[messages.length - 1]; // in reality it's the last one in current selection
            c.received = c.last.received;
            c.unread = messages.filter(function(m) {
                return m.unread;
            }).length > 0;

            c.labels = [];
            messages.forEach(function(m) {
                m.labels.forEach(function(l) {
                    if (c.labels.indexOf(l) == -1) {
                        c.labels.push(l);
                    }
                });
            });
        } else {
            if (c.labels.indexOf("draft") > -1) {
                c.draft = true;
            }
        }
        return c;
    });


    return combined;
}

function pushToQueue(queue, message) {
    var client = beanstalk.Client();
    client.use(queue).onSuccess(function(data) {
        client.put(message).onSuccess(function(data) {
            console.log("Message " + message +  " pushed to queue " + queue);
            client.disconnect();
        });
    });
}



function createThumbnail(path, filetype, _callback) {

    var thumbnail = path + ".thumb";

    //convert -density 300 input.pdf[0] -scale 400000 output.png
    
    if (fs.existsSync(thumbnail)) {
        _callback(null, thumbnail);
        return;
    }

    var params = "";

    if (filetype == 'image/png' || filetype == 'image/jpeg' || filetype == 'image/jpg') {
        var t = filetype.split('/')[1];
        params = "-define " + t + " " + path + " -auto-orient -thumbnail " + settings.PREVIEW_SIZE.width + "x" + settings.PREVIEW_SIZE.height + " -unsharp 0x.5 png:" + thumbnail;
    } else if (filetype == 'application/pdf') {
        params = path + "[0] -auto-orient -thumbnail " + settings.PREVIEW_SIZE.width + "x" + settings.PREVIEW_SIZE.height + " png:" + thumbnail;
    } else {
        _callback("Unknown type");
        return;
    }

    childProcess = require('child_process');
    var convert = childProcess.spawn("convert", params.split(" "));

    convert.stdout.on('data', function (data) {
    });

    convert.stderr.on('data', function (data) {
        console.error('stderr: ' + data);
    });

    convert.on('close', function (code) {
        if (code == 1) {
            log.error('child process exited with code ' + code + " for " + path);
            _callback("Can't resize: " + code);
            return;
        }
        _callback(null, thumbnail);
    });
}

 
module.exports = {
    AccessDenied : AccessDenied,

    flatToDict : flatToDict,
    mergeIntoThreads : mergeIntoThreads,

    uniqueId : uniqueId,
    uuid : uuid,
    createMessageId : createMessageId,

    writeToFile : writeToFile,
    readFromFile : readFromFile,
    deleteFile : deleteFile,
    deleteMessage : deleteMessageDir,

    createThumbnail : createThumbnail,

    pushToQueue : pushToQueue,

    getLogger : getLogger,

    messageParsedPath : messageParsedPath,
    attachmentPath : attachmentPath,
    draftPath : draftPath,
    eventSignature : eventSignature,

    mime : mime
}



