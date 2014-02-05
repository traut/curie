var isodate = require("isodate"),
    crypto = require('crypto'),
    fs = require('fs-ext'),
    async = require('async'),

    settings = require('../settings'),
    utils = require('../utils');

var mmm = require('mmmagic'),
    Magic = mmm.Magic;


var log = utils.getLogger("store.attachment");

AttachmentStore = function() {
    return {
        getPreview : function(handshake, options, callback) {
            var user = handshake.session.user.hash,
                attachment = options.attachmentId + ".attachment";

            //FIXME: security hole. we need to check if the requestor is the owner
            //

            var path = utils.attachmentPath(attachment);
            var thumbnail = path + ".thumb";

            if (!fs.existsSync(path)) {
                callback("File " + path + " dosn't exist");
                return;
            }

            function readAndSend(filepath, reply) {
                console.info("Reading " + filepath);
                if (!fs.existsSync(filepath)) {
                    callback("File " + filepath + " doesn't exist");
                    return;
                }
                fs.readFile(filepath, function (err, data) {
                    reply.thumbnail = new Buffer(data, 'binary').toString('base64');
                    callback(null, reply);
                });
            }

            async.parallel({
                stats : function(callback) {
                    fs.stat(path, callback); 
                },
                mime : function(callback) {
                    new Magic(mmm.MAGIC_MIME_TYPE).detectFile(path, callback);
                }
            }, function(err, results) {

                var filetype = results.mime;
                var filesize = results.stats.size;

                var reply = {
                    id : attachment,
                    filetype : filetype,
                    filesize : filesize,
                };

                if (err) {
                    callback(err, null);
                    return;
                }

                if (fs.existsSync(thumbnail)) {
                    readAndSend(thumbnail, reply);
                } else {

                    var PREVIEW_SIZE = {
                        width : 400,
                        height : 300
                    }

                    //convert -density 300 input.pdf[0] -scale 400000 output.png

                    var params = "";

                    if (filetype == 'image/png' || filetype == 'image/jpeg' || filetype == 'image/jpg') {
                        var t = filetype.split('/')[1];
                        params = "-define " + t + ":size=500x180 " + path + " -auto-orient -thumbnail " + PREVIEW_SIZE.width + "x" + PREVIEW_SIZE.height + " -unsharp 0x.5 png:" + thumbnail;
                    } else if (filetype == 'application/pdf') {
                        params = path + "[0] -auto-orient -thumbnail " + PREVIEW_SIZE.width + "x" + PREVIEW_SIZE.height + " png:" + thumbnail;
                    } else {
                        callback(null, reply);
                        return;
                    }
                    console.info("Making a thumbnail for " + path);
                    console.info("convert " + params);
                    var convert = require('child_process').spawn("convert", params.split(" "));

                    convert.stdout.on('data', function (data) {
                      console.log('stdout: ' + data);
                    });

                    convert.stderr.on('data', function (data) {
                      console.log('stderr: ' + data);
                    });

                    convert.on('close', function (code) {
                      console.log('child process exited with code ' + code);
                    });

                    convert.on('close', function (code) {
                        if (code == 1) {
                            callback("Can't resize: " + code, null);
                        }
                        callback(null, reply);
                    });

                }

            });
        },
        getAttachment : function(handshake, options, callback) {
        }
    }
};

module.exports = {
    AttachmentStore : AttachmentStore
}
