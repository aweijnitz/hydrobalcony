var util = require('util');
var Q = require('q');
var path = require('path');
var conf = require('./conf/db.json');

var log = function (msg) {
    console.log(msg);
};


/* Steps
 * 1 - Select all entries in DB.
 * 2 - For each entry
 *  2.1 - Read existing property 'timestamp' (format: '2015-05-06 15:04:48')
 *  2.2 - Convert to rethinkDB format and store in new property 'timestampraw'
 *  2.3 - Replace entry
 */

var migrateDb = function migrateDb(r, conn, dbName, tableName) {
    r.db(dbName).table(tableName)
        .replace(function (entry) {
            return entry.merge({
                // This is a way to get around ISO8601 date parsing
                // We're basically replacing a ' ' with 'T'
                'timestampraw': r.ISO8601(
                    entry('timestamp').split()(0).add('T').add(entry('timestamp').split()(1)),
                    {
                        defaultTimezone: '+2'
                    })
            });
        })
        .run(conn, {useOutdated: true, arrayLimit: 1000000}, function (err, res) {
            if (err) throw err;
            log(util.inspect(res));
            conn.close(function (err) {
                if (err) throw err;
                console.log('Done!');
            })
        });
};


var r = require('rethinkdb');
r.connect(conf).then(function (conn) {
    migrateDb(r, conn, conf.db, conf.tableName);
});
