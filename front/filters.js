var barista = require('barista'),
    crypto = require('crypto'),
    fs = require('fs'),
    async = require('async'),

    sqlite3 = require('sqlite3').verbose(),

    settings = require('./settings'),
    utils = require('./utils');

var log = utils.getLogger("filter");

var db = new sqlite3.Database('/home/curie/curie/filters.db');

function addFilter(account, query, label, skip_inbox, callback) {

    db.run("insert into filters (hash, query, label, skip_inbox) values (?, ?, ?, ?)", [account, query, label, (skip_inbox == true) ? 1 : 0], function(err) {
        if (err != null) {
            log.error(util.format("Can't create a filter query='%s', label=%s, skip_inbox=%s. Error: %s", query, label, skip_inbox, err));
            callback(err, null);
            return;
        };

        log.info("Filter created: id=%s", this.lastID);
        callback(null, {
            id : this.lastID,
            skip_inbox : skip_inbox,
            query : query,
            label : label
        });
    });
}

function getFilters(account, callback) {
    db.all("SELECT id, query, label, skip_inbox FROM filters WHERE filters.hash = ?", [account], callback);
};

function getFilter(account, filterId, callback) {
    db.all("SELECT id, query, label, skip_inbox FROM filters WHERE filters.hash = ? and filters.id = ?", [account, filterId], callback);
};

function rerunFilter(account, filterId, callback) {
    db.all("SELECT id, query, label, skip_inbox FROM filters WHERE filters.hash = ? AND filters.id = ?", [account, filterId], function(err, results) {
        if (results.length == 0) {
            return;
        }
        utils.pushToQueue("relabel", filterId);
    });
};

function deleteFilter(account, id, callback) {
    db.run("DELETE FROM filters WHERE hash = ? AND id = ?", [account, id], callback);
};

module.exports = {
    getFilters : getFilters,
    getFilter : getFilter,
    addFilter : addFilter,
    rerunFilter : rerunFilter,
    deleteFilter : deleteFilter
}
