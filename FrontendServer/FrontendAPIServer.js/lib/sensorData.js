var util = require('util');
var Q = require('q');


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
var selectInDb = function (name, limit, rdb, dbName, tableName, logger) {
    logger.debug('loading ', name, limit);
    var deferred = Q.defer();
    rdb.db(dbName).table(tableName).orderBy({index: rdb.desc('timestamp')})
        .filter(rdb.row('name').eq(name))
        .limit(limit)
        .pluck('timestamp', 'value')
        .then(function (res) {
            logger.debug('results ', res.length);
            deferred.resolve(res);
        }).error(function (err) {
            logger.error(util.inspect(err));
            deferred.reject(new Error('Could not load sensor data. Err:' + util.inspect(err)));
        });
    return deferred.promise;
};

var sensorDataFactory = function (appConf, log4js) {
    var logger = log4js.getLogger('sensorData');
    var selectFunction = null;

    // Setup db
    if (!rdb && appConf.app.storageStrategy === 'dbStore') {
        logger.info('Using DB Store. Connecting to db at ' + (appConf.app.dbStore.host || "127.0.0.1"));
        rdb = connectDb(appConf.app.dbStore);
        selectFunction = function (name, limit) {
            return selectInDb(name, limit, rdb, appConf.app.dbStore.dbName, appConf.app.dbStore.sensorTableName, logger);
        };
    } else
        throw new Error('no dbStore configured in appConfig.json!');


    return function sensorData(name, limit) {
        return selectFunction(name, limit);
    };
};

exports = module.exports = sensorDataFactory;
