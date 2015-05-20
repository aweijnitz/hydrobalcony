var util = require('util');
var moment = require('moment');


/**
 * Return handler for displaying upcoming pump trigger times.
 * Example urls:
 *  - http://localhost:7878/pumpschedule?count=20&format=json
 *  - http://localhost:7878/pumpschedule?count=16 (yields html version)
 * @param appConf
 * @param log4js
 * @returns {Function}
 */
var handleReq = function (appConf, log4js) {
    var logger = log4js.getLogger("pumpSchedule");

    return function latestData(req, res) {
        logger.debug('pumpschedule route invoked');
        pumpCtrl = require('../lib/control/PumpController').getPumpController();
        var count = req.query.count || 16;
        var format = req.query.format || 'html';
        var times = pumpCtrl.upcomingTimes(count).map(function(i) { return moment(i).format("dddd, MMMM Do YYYY, HH:mm:ss Z"); });
        if('json' === format)
            res.json(times);
        else
            res.render('pumpschedule', { schedule: times });
    };

};

module.exports = handleReq;
