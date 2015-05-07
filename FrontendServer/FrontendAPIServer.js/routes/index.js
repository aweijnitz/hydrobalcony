var appConf = require('../conf/appConfig.json');
var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure('./conf/log4js.json');
var logger = log4js.getLogger("index");

var sensorData = require('../lib/sensorData')(appConf, log4js);

// Remember, in Express 4, '/' is the root under which this route is mounted, so does not
// necessarily correspond to the absolute root of the domain.
//
router.get('/', function (req, res) {
    logger.debug('Serving / --> index.hjs');
    res.render('index', {title: 'Welcome to the empty server'});
});

router.get('/sensordata/:sensorname', function (req, res) {
    var sensorname = req.params.sensorname;
    var limit = req.query.limit || 100;
    logger.debug('Serving /sensordata', sensorname, limit);
    sensorData(sensorname, limit).then(function(res) { res.json(res); });
});

module.exports = router;
