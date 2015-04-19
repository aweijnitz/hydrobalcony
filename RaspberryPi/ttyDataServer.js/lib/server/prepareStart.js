var Deferred = require("promised-io/promise").Deferred;


module.exports = function (appConf, log4js) {
    var logger = log4js.getLogger("prepare");
    var deferred = new Deferred();
    return function preServerStart(expressApp) {
        logger.info('Preparing server start');


        deferred.resolve(); // do this in the callback of any async operation, like a file read.
        // deferred.reject(); in case of error
        return deferred.promise;
    };
};