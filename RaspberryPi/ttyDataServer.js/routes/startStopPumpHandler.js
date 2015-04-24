var util = require('util');

var latestCommand = '';

var writeAndDrain = function writeAndDrain (tty, data, callback) {
    tty.write(data, function () {
        tty.drain(callback);
    });
};

var pump = function pump(action, tty, logger) {
    logger.debug('Setting pump: '+action);
    if(!!tty) {
        logger.debug('Writing to serial');
        writeAndDrain(tty, new Buffer('rp','ascii'), function() {
            logger.debug('Sent command: rp');
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
    var controlKey = appConf.controlKey
    var logger = log4js.getLogger("pumpcontrol");

    return function latestData(req, res) {
        logger.debug('pumpcontrol route invoked. action: ' + req.params.action);

        var keyOk = (req.query.key === controlKey);
        var action = req.params.action || false;

        if (readOnly || !keyOk)
            res.status(401).json({ status: 'nope' });
        else if (!!action && action === 'on') {
            pump(true, req.app.get('tty'), logger);
            latestCommand = action;
            res.json({ status: action });
        } else if (!!action && action === 'off') {
            pump(false, req.app.get('tty'), logger);
            latestCommand = action;
            res.json({ status: action });
        } else
            res.json({ status: latestCommand});
    };

};

module.exports = handleReq;