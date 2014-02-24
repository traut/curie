var barista = require('barista'),
    crypto = require('crypto'),
    fs = require('fs'),
    async = require('async'),

    sqlite3 = require('sqlite3').verbose(),

    settings = require('./settings'),
    utils = require('./utils');

var log = utils.getLogger("users");

var db = new sqlite3.Database(settings.DB.USERS);

function hashPassword(password) {
    return crypto.createHash('sha512', crypto.randomBytes(256)).update(password).digest('hex');
}

function addAccount(login, password, emailsWithNames) {
    var hash = crypto.createHash('sha1', crypto.randomBytes(256)).update(login).digest('hex');

    db.run("INSERT INTO accounts (hash, login, password) VALUES (?, ?, ?)", [hash, login, hashPassword(password)], function(err) {
        if (err != null) {
            log.error(util.format("Can't create an account %s: %s", login, err));
            return;
        };

        var id = this.lastID;

        var stmt = db.prepare("INSERT INTO emails (account_id, email, fullname) VALUES (?, ?, ?)");
        emailsWithNames.map(function(email) {
            stmt.run(id, email.email, email.fullname);
        });
        stmt.finalize();

        log.info("Account %s created with %s email addresses", id, emailsWithNames.length);
    });
}


function signIn(login, password, callback) {
    db.get("SELECT hash FROM accounts WHERE login = ? AND password = ?", [login, hashPassword(password)], callback);
}

function getAccountEmails(hash, callback) {
    db.all("SELECT email, fullname, main FROM emails, accounts WHERE emails.account_id = accounts.id AND accounts.hash = ?", [hash], callback);
}

function getAccountDetails(hash, callback) {
    getAccountEmails(hash, function(err, emails) {
        if (err) {
            callback(err);
            return;
        }
        if (!emails || emails == null || emails.length == 0) {
            callback("No emails for hash " + hash);
            return;
        }
        var markedAsMain = emails.filter(function(e) {
            return e.main == 1;
        });

        var primary;
        if (markedAsMain.length > 0) {
            var firstone = markedAsMain[0];
            primary = {
                email : firstone.email,
                name : firstone.fullname,
            };
        } else {
            var firstone = emails[0];
            primary = {
                email : firstone.email,
                name : firstone.fullname,
            };
        }
        callback(null, {
            primary : primary,
            all : emails.map(function(e) {
                return {
                    name : e.fullname,
                    email : e.email
                };
            })
        });
    });
}


module.exports = {
    addAccount : addAccount,
    signIn : signIn,
    getAccountEmails : getAccountEmails,
    getAccountDetails : getAccountDetails
}
