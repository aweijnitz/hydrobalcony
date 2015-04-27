var path = require('path');
var appConf = require('./conf/appConfig.json');
var log4js = require('log4js');
log4js.configure('./conf/log4js.json');
var logger = log4js.getLogger('MAIN');
var prepServerStart = require('./lib/server/prepareStart')(appConf, log4js);
var shutdownHook = require('./lib/server/shutdownHook')(appConf, log4js);

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

logger.info('Prepare server start ');
prepServerStart().then(function (result) {

    // Check that prep went without errors (paranoid!)
    if (result instanceof Error)
        exitWithError(1, 'Failed to prepare server start! ' + util.inspect(result));

    logger.info('Installing shutdown hook');
    mountShutdownHooks();

    logger.info('Starting server');
    app.set('port', (appConf.server.port || process.env.PORT) || 8080);

    var server = app.listen(app.get('port'), function () {
        logger.info('Server listening on port ' + server.address().port);
    });

}, function (err) { // Invoked if promised is rejected
    exitWithError(1, 'Preparation rejected. Failed to prepare server start! ' + util.inspect(result));
});


