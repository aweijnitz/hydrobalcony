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
        buffer: 1,
        max: 2,
        timeout: 10,
        timeoutError: 2 * 1000,
        timeoutGb: 10 * 60 * 1000,
        silent: false,
        cursor: false,
        pool: true
    }; // See https://github.com/neumino/rethinkdbdash

    return require('rethinkdbdash')(dbOpts);
};

var dbConf = {
    host: "localhost",
    port: "28015",
    dbName: "hydro",
    tableName: "sensordata",
    authKey: ""
};

// Trigger bug (using "rethinkdbdash": "^2.0.9" in package.json)
var rdb = connectDb(dbConf);
rdb.db(dbConf.dbName).table(dbConf.tableName).insert({ test: 'value' }).then(function (res) {
    console.log(res);
}).error(function (err) {
    console.log(err);
});
