var barista = require('barista'),
    crypto = require('crypto'),
    fs = require('fs'),
    async = require('async'),

    sqlite3 = require('sqlite3').verbose(),

    settings = require('./settings'),
    utils = require('./utils');

var log = utils.getLogger("users");

// hacky for now
var db = new sqlite3.Database('/home/curie/curie/users.db');

function hashPassword(password) {
    return crypto.createHash('sha512', crypto.randomBytes(256)).update(password).digest('hex');
}

function addAccount(login, password, emails) {
    var hash = crypto.createHash('sha1', crypto.randomBytes(256)).update(login).digest('hex');

    db.run("insert into accounts (hash, login, password) values (?, ?, ?)", [hash, login, hashPassword(password)], function(err) {
        if (err != null) {
            log.error(util.format("Can't create an account %s: %s", login, err));
            return;
        };

        var id = this.lastID;

        var stmt = db.prepare("INSERT INTO emails (account_id, email) VALUES (?, ?)");
        emails.map(function(email) {
            stmt.run(id, email);
        });
        stmt.finalize();

        log.info("Account %s created with %s email addresses", id, emails.length);
    });
}


function signIn(login, password, callback) {
    db.get("SELECT hash FROM accounts WHERE login = ? AND password = ?", [login, hashPassword(password)], callback);
}

function getAccountEmails(hash, callback) {
    db.all("SELECT email FROM emails, accounts WHERE emails.account_id = accounts.id AND accounts.hash = ?", [hash], callback);
}


module.exports = {
    addAccount : addAccount,
    signIn : signIn,
    getAccountEmails : getAccountEmails
}
