//var appConf = require('../conf/appConfig.json');
var os = require('os');
var fs = require('fs');
var all = require("promised-io/promise").all;

var path = require('path');
var util = require('util');
//var logger = require('log4js').getLogger("upload");


/**
 * Private helper to sanity check a string before using it.
 * @param str
 * @returns {boolean}
 */
var isDefined = function (str) {
    return (typeof str != 'undefined' && null != str && '' != str);
}

/**
 * Check that dir exists
 * @param dir
 * @returns {boolean}
 */
var exists = function exists(dir) {
    var stat = fs.statSync(dir);
    return stat.isDirectory();
};


var sendFile = function sendFile(res, fileName, logger) {

    var options = {
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile(path.resolve(fileName), options, function (err) {
        if (err) {
            logger.error('Could not serve file ' + fileName + ' Status: ' + err.status);
            res.status(err.status).end();
        }
        else {
            logger.debug('Sent:', fileName);
        }
    });


};

var handleReq = function (appConf, log4js) {
    var logger = log4js.getLogger("rawlog");

    return function history(req, res) {
        logger.debug('rawlog route invoked');
        if (!!appConf.app.dataFile)
            fs.readFile(appConf.app.dataFile, {encoding: 'utf8'}, function (err, data) {
                if (err) throw err;
                sendFile(res, appConf.app.dataFile, logger);
            });
        else
            logger.debug('No app.dataFile configured.');
    };

};

module.exports = handleReq;
