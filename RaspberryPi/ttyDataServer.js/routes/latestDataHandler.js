var util = require('util');
var cache = null;


/**
 * Return handler for API request to get latest known data
 * @param appConf
 * @param log4js
 * @returns {Function}
 */
var handleReq = function (appConf, log4js) {
    var logger = log4js.getLogger("latestdata");
    cache = require('../lib/dataCache')(appConf, log4js);

    return function latestData(req, res) {
        logger.debug('latestdata route invoked');
        res.json(cache.getAll());
    };

};

module.exports = handleReq;
