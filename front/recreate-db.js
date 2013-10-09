
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/curie/curie/users.db');

db.serialize(function() {
    db.run("DROP TABLE accounts");
    db.run("DROP TABLE emails");

    db.run("CREATE TABLE accounts"
        + " (id  INTEGER PRIMARY KEY AUTOINCREMENT, hash VARCHAR(40), login VARCHAR(255), password VARCHAR(500),"
        + " UNIQUE(hash) ON CONFLICT REPLACE, UNIQUE(login) ON CONFLICT REPLACE)");
    db.run("CREATE TABLE emails (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, email VARCHAR(255));");
});


// require("./users").addAccount("test", "test", ["t@curie.heyheylabs.com", "dev@arrr.tv", "webmaster@arrr.tv"]);
