/**
 * This module fetches sensor data from the database.
 */

var util = require('util');
var Q = require('q');
var moment = require('moment');


// Db connection. singleton
var rdb = null;

var connectDb = function (dbConf) {
    var dbHost = dbConf.host || "localhost";
    var dbPort = dbConf.port || 28015;
    var dbName = dbConf.dbName;
    var authKey = dbConf.authKey || '';
    var dbOpts = {
        host: dbHost,
        port: dbPort,
        db: dbName,
        authKey: authKey,
        buffer: 10,
        max: 50,
        timeout: 10,
        timeoutError: 2 * 1000,
        timeoutGb: 10 * 60 * 1000,
        silent: false,
        cursor: false,
        pool: true
    }; // See https://github.com/neumino/rethinkdbdash

    return require('rethinkdbdash')(dbOpts);
};


/**
 * Select data in DB. Returns promise
 * @param name - sensor name
 * @param limit - limit
 * @param rdb - db connection instance
 * @param dbName
 * @param tableName
 * @param logger
 * @returns {*}
 */
var selectInDb = function (name, timeWindow, fromDate, toDate, r, dbName, tableName, logger) {
    var deferred = Q.defer();

    if (timeWindow > 0) {
        logger.debug('loading for timeWindow', name, timeWindow);
        r.db(dbName).table(tableName).orderBy({index: r.desc('timestamp')})
            .filter(r.row('timestamp').during(r.now().add(-1 * timeWindow), r.now())
                .and(r.row('name').eq(name)))
            .pluck(['timestamp', 'value'])
            .then(function (res) {
                logger.debug('results ', res.length);
                deferred.resolve(res);
            }).error(function (err) {
                logger.error(util.inspect(err));
                deferred.reject(new Error('Could not load sensor data. Err:' + util.inspect(err)));
            });
    } else if(fromDate && moment.isDate(fromDate) && toDate && moment.isDate(toDate)) {
        logger.debug('loading for date range', name, fromDate, toDate);
        r.db(dbName).table(tableName).orderBy({index: r.desc('timestamp')})
            .filter(r.row('timestamp').during(r.ISO8601(new Date(fromDate)), r.ISO8601(new Date(toDate)))
                .and(r.row('name').eq(name)))
            .pluck(['timestamp', 'value'])
            .then(function (res) {
                logger.debug('results ', res.length);
                deferred.resolve(res);
            }).error(function (err) {
                logger.error(util.inspect(err));
                deferred.reject(new Error('Could not load sensor data. Err:' + util.inspect(err)));
            });
    } else {
        logger.error('Neither valid timeWindow or from and to dates provided.');
        deferred.reject(new Error('Neither valid timeWindow or from and to dates provided'));
    }
    return deferred.promise;
};

var sensorDataFactory = function (appConf, log4js) {
    var logger = log4js.getLogger('sensorData');
    var selectFunction = null;

    // Setup db
    if (!rdb && appConf.app.storageStrategy === 'dbStore') {
        logger.info('Using DB Store. Connecting to db at ' + (appConf.app.dbStore.host || "127.0.0.1"));
        rdb = connectDb(appConf.app.dbStore);
        selectFunction = function (name, limit, fromDate, toDate) {
            return selectInDb(name, limit, fromDate, toDate, rdb, appConf.app.dbStore.dbName, appConf.app.dbStore.sensorTableName, logger);
        };
    } else
        throw new Error('no dbStore configured in appConfig.json!');


    return function sensorData(name, timeWindow) {
        if (name instanceof Array) {
            // Query DB once for each sensor name in the name[] array
            // then combine the results into one multi-value array.
            // Return promise which resolves to the combined array.
            var deferred = Q.defer();
            var promises = [];
            name.forEach(function (sensorName) {
                promises.push(selectFunction(sensorName, timeWindow));
            });
            Q.all(promises).then(function combine(res) {
                //logger.debug('COMBINE', res);
                var combined = res[0].map(function (sensorValueObj, index) {
                    var obj = {
                        timestamp: sensorValueObj.timestamp
                    };
                    name.forEach(function addValues(nme, i) {
                        obj[nme] = res[i][index].value;
                    });
                    return obj;
                });
                deferred.resolve(combined);
            });
            return deferred.promise;
        }
        else
            return selectFunction(name, timeWindow);
    };
};

exports = module.exports = sensorDataFactory;
