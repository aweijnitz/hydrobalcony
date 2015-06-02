var path = require('path');
var exit = require('exit');
var moment = require('moment');
var r = require('rethinkdb');
var fse = require('fs-extra');
var argv = require('minimist')(process.argv.slice(2));
var log4js = require('log4js');
log4js.configure(path.resolve('./conf/log4js.json'));

var logger = log4js.getLogger('main');
var cacheDir = path.resolve(path.join(__dirname, 'cache'));


//logger.debug(argv);

var dbOpts = {
    host: 'localhost',
    port: 28015,
    db: 'hydro',
    authKey: ''
};

if (argv._.length != 3) {
    console.log('Usage: node hydrostats.js sensorName timeFrameExpression cacheFileName');
    console.log('Example: node hydrostats.js waterTemp 10*24*60*60 waterTemp10days.json');
    exit(1);
}

var sensorName = argv._[0];
var timeFrame = eval(argv._[1]);
var fileName = argv._[2];

// Reporter
//
var latestTemp = require('./lib/latestSensorReadings');

// Result handler
//
var writeToFile = function writeToFile(fileName, result) {
    logger.debug('Writing', fileName);
    fse.outputJsonSync(fileName, result);
};

var startTime = Date.now();
r.connect(dbOpts)
    .then(latestTemp(r, sensorName, timeFrame, function (err, cursor, conn) {
        if (err)
            exit(2);
        cursor.toArray(function (err, result) {
            if (err)
                exit(3);
            writeToFile(path.join(cacheDir, fileName), result);
            cursor.close();
            conn.close();
            var duration = moment.duration(Date.now() - startTime);
            logger.info('Done. ', sensorName, timeFrame, fileName, 'Duration:', duration.humanize());
        });
    }))
    .error(function (err) {
        exit(1);
    });



