var util = require('util');
var Q = require('q');
var fse = require('fs-extra');


var validate = function (evt) {
    return (evt != null && typeof evt == 'object') && evt.hasOwnProperty('data');
};

// Database storage
//
//

// Db connection. singleton
var rdb = null;

var connectDb = function (dbConf) {
    var dbHost = dbConfdbHost || "localhost";
    var dbPort = dbConfdbPort || 28015;
    var dbName = dbConfdbName;
    var authKey = dbConfdbAuthKey || '';
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


/**
 * Store event in file and return promise
 * @param evt
 */
var storeFile = function (evt, file) {
    var deferred = Q.defer();
    fse.appendFile(file, JSON.stringify(evt) + '\n', function (err) {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(file);
    });
    return deferred;
};

/**
 * Store in DB. Returns promise
 * @param sensorEvt
 * @param rdb
 * @param dbName
 * @param tableName
 * @param logger
 * @returns {*}
 */
var storeDB = function (sensorEvt, rdb, dbName, tableName, logger) {
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
    return deferred;
};

var storeEventFactory = function (appConf, log4js) {
    var logger = log4js.getLogger('storeEvent');
    var tableName = appConf.app.dbStore.sensorTableName;
    var storeFunction = null;

    // Setup db storage
    if (!rdb && appConf.app.storageStrategy === 'dbStore') {
        logger.info('Using DB Store. Connecting to db at ' + (appConf.app.dbHost || "localhost"));
        rdb = connectDb(appConf.app.dbStore);
        storeFunction = (function (rdb, dbName, tableName, logger) {
            return function (evt) {
                return storeDB(evt, rdb, dbName, tableName, logger);
            };
        })(rdb, appConf.app.dbStore.dbName, appConf.app.dbStore.sensorTableName, logger);

    // Setup file storage
    } else if (appConf.app.storageStrategy === 'fileStore') {
        logger.info('Using fileStore in file ' + appConf.app.fileStore.name);
        fse.ensureFileSync(appConf.app.fileStore.name);
        storeFunction = (function (fileName) {
            return function (evt) {
                return storeFile(evt, fileName);
            };
        })(appConf.app.fileStore.name);
    }

    return function storeEvent(sensorEvt) {
        return storeFunction(sensorEvt);
    };
};

exports = module.exports = storeEventFactory;
