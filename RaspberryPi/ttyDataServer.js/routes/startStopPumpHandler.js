var util = require('util');

var latestCommand = '';

var writeAndDrain = function writeAndDrain(tty, data, callback) {
    tty.write(data, function (err) {
        if (!!err) throw err;
        tty.drain(callback);
    });
};

/**
 * Turn pump on and off by writing to the tty device.
 * Commands: https://github.com/aweijnitz/hydrobalcony/blob/master/RaspberryPi/bitlash/bitlash-functions.txt
 *
 * @param action - boolean for on and off respectively
 * @param tty -  the device (instance of ttyDeviceHandler)
 * @param callback - called on successful completion
 * @param logger - log4js instance to log to
 */
var pump = function pump(action, tty, callback, logger) {
    logger.debug('Setting pump: ' + action);
    if (!!tty && action) {
        logger.debug('Start pump');
        writeAndDrain(tty, new Buffer('rp', 'ascii'), function (err) {
            if (!!err) {
                logger.error('Pump start FAILED. err: ' + util.inspect(err));
                callback(err);
            }
            logger.debug('Sent command: rp');
            callback();
        });
    } else if (!!tty && !action) {
        logger.debug('Stop pump');
        writeAndDrain(tty, new Buffer('sp', 'ascii'), function (err) {
            if (!!err) {
                logger.error('Pump stop FAILED. err: ' + util.inspect(err));
                callback(err);
            }
            logger.debug('Sent command: sp');
            callback();
        });
    } else
        logger.warn('No tty found!');
};

/**
 * Return handler for API request to control pump. Certain conditions apply.
 * Env. variables HYDRO_CONTROL_KEY and HYDRO_CONTROL must be set before starting the server.
 * A matching query parameter 'key' must be passed along with the request.
 * Ex. /pump/on?key=abcd1234
 *
 * @param appConf
 * @param log4js
 * @returns {Function}
 */
var handleReq = function (appConf, log4js) {
    var readOnly = !(!!appConf.controlEnabled);
    var controlKey = appConf.controlKey;
    var logger = log4js.getLogger("pumpcontrol");

    return function latestData(req, res) {
        logger.debug('pumpcontrol route invoked. action: ' + req.params.action);

        var keyOk = (req.query.key === controlKey);
        var action = req.params.action || false;
        var tty = req.app.get('tty');
        var pumpCallback = function (err) {
            if (!!err)
                res.status(502).json({status: 'Could not write to device!'});
            else {
                latestCommand = action;
                res.json({status: action});
            }
        };

        if (readOnly || !keyOk)
            res.status(401).json({status: 'nope'});
        else if (!!action && action === 'on')
            pump(true, tty, pumpCallback, logger);
        else if (!!action && action === 'off')
            pump(false, tty, pumpCallback, logger);
        else
            res.json({status: latestCommand});
    };

};

module.exports = handleReq;
