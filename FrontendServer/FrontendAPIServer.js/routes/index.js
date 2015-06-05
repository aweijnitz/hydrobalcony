var moment = require('moment');
var appConf = require('../conf/appConfig.json');
var express = require('express');

var router = express.Router();

var log4js = require('log4js');
log4js.configure('./conf/log4js.json');
var logger = log4js.getLogger("index");

var sensorData = require('../lib/sensorDataFromDb')(appConf, log4js);
var cache = require('../lib/util/dataCache')(appConf, log4js);

// Remember, in Express 4, '/' is the root under which this route is mounted, so does not
// necessarily correspond to the absolute root of the domain.
//
router.get('/', function (req, res) {
    logger.debug('Serving / --> index.hjs. req.ips: ', req.ips);
    res.render('index', {title: 'Welcome to the empty server'});
});

router.get('/latest/:sensorname?', function (req, res) {
    var sensorname = req.params.sensorname;
    logger.debug('Serving /latest. sensorname',sensorname);
    if(sensorname && cache.get(sensorname))
        res.json(cache.get(sensorname));
    else if (sensorname && !cache.get(sensorname))
        res.json({ msg: 'No data available yet.', fail: true});
    else if(!sensorname)
        res.json(cache.getAll());
});

var day = 24 * 60 * 60; // seconds in 24h
router.get('/sensordata/:sensorname', function (req, res) {
    var sensorname = req.params.sensorname;
    var timeWindow = parseInt(req.query.limit) || day;
    var from = req.query.from;
    var to = req.query.to;
    if (from && moment.isDate(from)) from = new Date(from);
    if (to && moment.isDate(to)) to = new Date(to);
    if (to && from) {
        timeWindow = -1; // Can't have both a time duration AND a date interval.
        if (moment(to).isBefore(from)) {
            var swp = to;
            to = from;
            from = swp;
        }
    }

    logger.debug('Serving /sensordata', sensorname, timeWindow);
    sensorData(sensorname, timeWindow, from, to)
        .then(function ok(result) {
            res.json(result);
        })
        .fail(function error(err) {
            logger.info(err);
            res.status(500).json({ error: err })
        })
        .done();

});

router.get('/temperatures', function (req, res) {
    var sensornames = ['waterTemp', 'airTemp'];
    var timeWindow = parseInt(req.query.limit) || day;
    logger.debug('Serving /temperatures', sensornames, timeWindow);
    sensorData(sensornames, timeWindow).then(function (result) {
        res.json(result);
    });
});

module.exports = router;
