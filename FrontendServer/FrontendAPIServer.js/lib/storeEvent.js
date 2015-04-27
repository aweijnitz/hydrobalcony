var util = require('util');
var Q = require('q');


var validate = function (evt) {
    return (evt != null && typeof evt == 'object') && evt.hasOwnProperty('data');
};

// Db connection. singleton
var rdb = null;

var connectDb = function (appConf) {
    var dbHost = appConf.app.dbHost || "localhost";
    var dbPort = appConf.app.dbPort || 28015;
    var dbName = appConf.app.dbName;
    var authKey = appConf.app.dbAuthKey || '';
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
        cursor: false
    }; // See https://github.com/neumino/rethinkdbdash

    return require('rethinkdbdash')(dbOpts);
};

var storeEventFactory = function (appConf, log4js) {
    var logger = log4js.getLogger('storeEvent');
    var dbName = appConf.app.dbName;
    var tableName = appConf.app.sensorTableName;

    if (!rdb) {
        logger.info('Connecting to db at ' + (appConf.app.dbHost || "localhost"));
        rdb = connectDb(appConf);
    }

    /** Returns promise which resolves when event has been stored.
     *
     */
    return function storeEvent(sensorEvt) {
        var deferred = Q.defer();
        if (validate(sensorEvt)) {
            rdb.db(dbName).table(tableName).insert(sensorEvt).then(function (res) {
                logger.debug('Event stored: ' + util.inspect(sensorEvt));
                deferred.resolve(res);
            }).error(function (err) {
                logger.error(util.inspect(err));
                deferred.reject(new Error('Could not store sensor event. Err:' + util.inspect(err)));
            });
        } else
            deferred.reject(new Error('Invalid sensor event'));
    };
};

exports = module.exports = storeEventFactory;
