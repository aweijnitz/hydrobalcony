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


/**
 * Public. Takes care of form parsing and processing of form fields.
 * @param req
 * @param res
 */
var handleForm = function (appConf, log4js) {
    var logger = log4js.getLogger("history");

    // Local conf
    var dataFile = appConf.app.dataFile;


    return function history(req, res) {
        logger.debug('History route invoked');
        if (!!dataFile)
            fs.readFile(dataFile, {encoding: 'utf8'}, function (err, data) {
                if (err) throw err;
                res.render('history', { history: data });
            });
    };

};

module.exports = handleForm;
