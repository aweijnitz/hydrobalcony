var util = require('util');
var Q = require('q');
var path = require('path');
var conf = require('./conf/db.json');
var r = require('rethinkdb');

var fromTable = 'sensordata0';
var toTable = 'sensordata';

var log = function (msg) {
    console.log(msg);
};


var moveAllSensorData = function moveAllSensorData(r, readConn, writeConn, dbName, fromTable, toTable, close) {
    var written = 0;
    log('Moving data from '+dbName+'.'+fromTable+' to '+dbName+'.'+toTable);
    r.db(dbName).table(fromTable)
        .orderBy({index: r.desc('timestamp')})
        .run(readConn, {useOutdated: true, arrayLimit: 3000000}).then(function (cursor) {
            var buf = [];
            var flushLimit = 5000;

            var flushBuffer = function flushBuffer(isFinal) {
                r.db(dbName).table(toTable).insert(buf
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

            var fetchNext = function fetchNext(result) {
                buf.push(result);
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
        //ensureTable(r, readConn, conf.db, statsTableName, false);
        //statsIndexNames.forEach(function(indexName) {  ensureIndex(r, readConn, conf.db, statsTableName, indexName, false); });
        moveAllSensorData(r, readConn, writeConn, conf.db, fromTable, toTable, false);
    })
});
