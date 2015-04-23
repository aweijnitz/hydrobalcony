var util = require('util');
var path = require('path');
var appConf = require('./conf/appConfig.json');
var log4js = require('log4js');
log4js.configure('./conf/log4js.json');

var logger = log4js.getLogger('MAIN');
var prepServerStart = require('./lib/server/prepareStart')(appConf, log4js);
var shutdownHook = require('./lib/server/shutdownHook')(appConf, log4js);
var SerialPortHandler = require('./lib/ttyDeviceHandler.js');
var ttyDataHandler = require('./lib/ttyDataHandler.js');


var fse = require('fs-extra');


logger.info('Preparing server start.');

var app = require('./lib/ttyDataServer')(appConf, log4js);


var exitWithError = function (code, msg) {
    logger.fatal(msg);
    process.exit(code);
};

// Configure graceful exits on SIGINT and SIGTERM
//
var mountShutdownHooks = function () {
    process.on('SIGINT', function () {
        logger.warn('Got SIGINT.  Shutting down');
        shutdownHook('SIGINT');
        exitWithError(0, 'Server shutdown');
    });

    process.on('SIGTERM', function () {
        logger.WARN('Got SIGTERM.  Shutting down');
        shutdownHook('SIGTERM');
        exitWithError(0, 'Server shutdown');
    });
};

logger.info('Prepare server start ');
prepServerStart(app).then(function (result) {

    // Check that prep went without errors (paranoid!)
    if (result instanceof Error)
        exitWithError(1, 'Failed to prepare server start! ' + util.inspect(result));

    logger.info('Installing shutdown hook');
    mountShutdownHooks();

    logger.info('Starting server');
    app.set('port', (appConf.server.port || process.env.PORT ) || 8080);
    app.set('host', (appConf.server.host || process.env.HOST ) || 'localhost');

    var server = app.listen(app.get('port'), app.get('host'), function () {
        logger.info('Server listening: '+ util.inspect(server.address()));
    });


    logger.info('Adding socket.io server');
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        socket.emit('clientConnect', { connectMsg: 'Welcome to the Hydrouino Garden!' });
    });
    app.set('socket.io', io);

    logger.info('Binding to serial device: ' + appConf.app.serialPort.device);
    var tty = new SerialPortHandler(appConf.app.serialPort.device,
        appConf.app.serialPort.baudrate,
        appConf.app.serialPort.buffer);

    fse.ensureFileSync(appConf.app.dataFile);

    var handler = ttyDataHandler(tty, appConf.app.dataFile, io, log4js);
    tty.on('data', handler);



}, function (err) { // Invoked if promised is rejected
    exitWithError(1, 'Preparation rejected. Failed to prepare server start! ' + util.inspect(result));
});


