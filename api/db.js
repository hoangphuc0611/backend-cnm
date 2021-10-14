"use strict";
const knex = require("knex");


// var sqlite3 = require('sqlite3').verbose();
// var file = "cwc.sqlite3";
// var db = new sqlite3.Database(file);

const db = knex({
    client: "sqlite3",
    connection: {
        filename: "cwc.sqlite3"
    }
})

module.exports = db;
