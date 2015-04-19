module.exports = function (conf, log4js) {
    var logger = log4js.getLogger("shutdown");
    return function shutdownHook(signalName) {
        // signalName is either 'SIGINT' or 'SIGTERM'
        logger.debug('Shutdown hook - Cleaning/saving data before exit');

    };
};

