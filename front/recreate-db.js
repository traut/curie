var settings = require('./settings'),
    sqlite3 = require('sqlite3').verbose();

var usersDB = new sqlite3.Database(settings.DB.USERS);
var filtersDB = new sqlite3.Database(settings.DB.FILTERS);

usersDB.serialize(function() {
    usersDB.run("DROP TABLE IF EXISTS accounts");
    usersDB.run("DROP TABLE IF EXISTS emails");
    usersDB.run("DROP TABLE IF EXISTS details");

    usersDB.run("CREATE TABLE accounts"
        + " (id  INTEGER PRIMARY KEY AUTOINCREMENT, hash VARCHAR(40), login VARCHAR(255), password VARCHAR(500),"
        + " UNIQUE(hash) ON CONFLICT REPLACE, UNIQUE(login) ON CONFLICT REPLACE)");

    usersDB.run("CREATE TABLE emails (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, email VARCHAR(255), fullname VARCHAR(500), main BOOLEAN DEFAULT 0);");

});

filtersDB.serialize(function() {
    filtersDB.run("DROP TABLE IF EXISTS filters");

    filtersDB.run("CREATE TABLE filters (id INTEGER PRIMARY KEY AUTOINCREMENT, hash VARCHAR(40), query VARCHAR(1000), label VARCHAR(500), skip_inbox BOOLEAN DEFAULT 0);");
});

