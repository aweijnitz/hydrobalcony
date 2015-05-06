var path = require('path');
var appConf = require('./conf/appConfig.json');
var log4js = require('log4js');
log4js.configure('./conf/log4js.json');
var logger = log4js.getLogger('MAIN');
var prepServerStart = require('./lib/server/prepareStart')(appConf, log4js);
var shutdownHook = require('./lib/server/shutdownHook')(appConf, log4js);
var storeEvent = require('./lib/storeEvent')(appConf, log4js);
var sensorClient = require('./lib/SensorDataClient').getSensorClient(appConf, log4js);

logger.info('Preparing server start.');

var app = require('./lib/setupExpressServer')(appConf, log4js);


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

var broadcast = function(msg, io) {
    io.sockets.emit(msg);
};

var endpointConnect = function endpointConnect(sensorClient, storeEvent, io, logger) {
    sensorClient.on('data', function onData (evt) {
        storeEvent(evt).then(function() {
            broadcast(evt, io);
        }, function storeError (err) {
            logger.error('Failed to store event');
        });
    });
    sensorClient.on('pump', function onPump (evt) {
        storeEvent(evt).then(function() {
            broadcast(evt, io);
        }, function storeError (err) {
            logger.error('Failed to store event');
        });
    });
    sensorClient.connect();
};

logger.info('Prepare server start ');
prepServerStart(app).then(function (result) {

    // Check that prep went without errors (paranoid!)
    if (result instanceof Error)
        exitWithError(1, 'Failed to prepare server start! ' + util.inspect(result));

    logger.info('Installing shutdown hook');
    mountShutdownHooks();

    logger.info('Connecting to sensor data endpoint');
    endpointConnect(sensorClient, storeEvent, io);


    logger.info('Starting server');
    app.set('port', (appConf.server.port || process.env.PORT) || 8080);

    var server = app.listen(app.get('port'), function () {
        logger.info('Server listening on port ' + server.address().port);
    });

    logger.info('Adding socket.io server');
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        socket.emit('clientConnect', { msg: 'Welcome to the Hydrouino Dream Garden!'});
    });
    app.set('socket.io', io);

}, function (err) { // Invoked if promised is rejected
    exitWithError(1, 'Preparation rejected. Failed to prepare server start! ' + util.inspect(result));
});


