var util = require('util');
var Q = require('q');
var path = require('path');
var conf = require('./conf/db.json');
var r = require('rethinkdb');

var log = function (msg) {
    console.log(msg);
};

var statsTableName = 'stats';
var tempTable = 'sensordata0';
var indexNames = ['timestamp', 'name'];

var ensureTable = function ensureTable(r, conn, dbName, tableName, close) {
    r.db(dbName).tableCreate(tableName).run(conn, {useOutdated: true, arrayLimit: 1000000}, function (err, res) {
        if (err && !/already exists/.test(err.msg)) throw err;
        //log(err);
        if (close)
            conn.close(function (err) {
                if (err) throw err;
                log('Connection closed!');
            })
        log('Table `' + tableName + '` ensured.');
    });
};

var ensureIndex = function ensureIndex(r, conn, dbName, tableName, indexName, close) {
    r.db(dbName).table(tableName).indexCreate(indexName)
        .run(conn, {useOutdated: true, arrayLimit: 1000000}, function (err, res) {
            if (err && !/already exists/.test(err.msg)) throw err;
            //  log(err);
            if (close)
                conn.close(function (err) {
                    if (err) throw err;
                    log('Connection closed!');
                })
            log('Index `' + indexName + '` ensured.');
        });
};


var makeValuesFloat = function makeValuesFloat(r, conn, writeConn, dbName, tableName, close) {
    var written = 0;

    r.db(dbName).table(tableName)
        .orderBy({index: r.desc('timestamp')})
        .filter(r.row('name').eq('waterTemp')
            .or(r.row('name').eq('airTemp'))
            .or(r.row('name').eq('lightLevel'))
            .or(r.row('name').eq('airPressure'))
            .or(r.row('name').eq('waterLevel')))
        .run(conn, {useOutdated: true, arrayLimit: 3000000}).then(function (cursor) {
            var buf = [];
            var flushLimit = 5000;

            var flushBuffer = function flushBuffer(isFinal) {
                r.db(dbName).table(tempTable).insert(buf
                    , {conflict: "replace"}
                ).run(writeConn).then(function (curs) {
                        written += buf.length;
                        log(written);
                        buf = [];
                        if (!isFinal)
                            cursor.next().then(fetchNext).error(errorHandler);
                        else
                            log('Final flush done!');
                    }).error(function (err) {
                        if (err) throw err;
                    });

            };

            var errorHandler = function errorHandler(err) {
                if (((err.name === "RqlDriverError") && err.message === "No more rows in the cursor.")) {
                    log("No more data to process");
                    flushBuffer(true);
                }
                else {
                    throw err;
                }
            };
            var processRow = function (entry) {
                entry.value = parseFloat(entry.value);
                //log(entry);
                return entry;
            };



            var fetchNext = function fetchNext(result) {
                buf.push(processRow(result));
                if (buf.length >= flushLimit) {
                    flushBuffer(false);
                } else
                    cursor.next().then(fetchNext).error(errorHandler);
            };

            // Start
            cursor.next().then(fetchNext).error(errorHandler);
        }).error(function (err) {
            throw err;
        });


};


r.connect(conf).then(function (readConn) {
    r.connect(conf).then(function (writeConn) {
        //ensureTable(r, readConn, conf.db, tempTable, true);
        //indexNames.forEach(function(indexName) {  ensureIndex(r, readConn, conf.db, tempTable, indexName, false); });
        //makeValuesFloat(r, readConn, writeConn, conf.db, conf.tableName, false);
    })
});
