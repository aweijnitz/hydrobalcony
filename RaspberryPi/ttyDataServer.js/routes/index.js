var appConf = require('../conf/appConfig.json');
var express = require('express');
var router = express.Router();

var log4js = require('log4js');
log4js.configure('./conf/log4js.json');
var logger = log4js.getLogger("index");


// Load route handlers (doubling as rudimentary MVC controllers)
var historyHandler = require('./history.js');
var dostuffHandler = require('./dostuffHandler.js');


// Remember, in Express 4, '/' is the root under which this route is mounted, so does not
// necessarily correspond to the absolute root of the domain.
//
router.get('/', function(req, res) {
  logger.debug('Serving / --> index.hjs');
  res.render('index', { title: 'Hydroino Dream Balcony' });
});


router.get('/history', historyHandler(appConf, log4js));

router.post('/dostuff', dostuffHandler(appConf, log4js));



module.exports = router;
