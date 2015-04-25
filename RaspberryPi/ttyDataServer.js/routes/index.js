
// Load route handlers (doubling as rudimentary MVC controllers)
var rawLogHandler = require('./rawlog');
var latestDataHandler = require('./latestDataHandler');
var pumpControl = require('./startStopPumpHandler');
var pumpSchedule = require('./pumpScheduleHandler');

var routerFactory = function router(appConf, log4js, router) {
    var logger = log4js.getLogger("index");

    // Remember, in Express 4, '/' is the root under which this route is mounted, so does not
    // necessarily correspond to the absolute root of the domain.
    //
    router.get('/', function (req, res) {
        logger.debug('Serving / --> index.hjs');
        res.render('index', {dummy: 'Hydrouino Dream Balcony'});
    });

    // Note: the data cache is setup when
    router.get('/latestdata', latestDataHandler(appConf, log4js));

    router.get('/rawlog', rawLogHandler(appConf, log4js));

    // Pump control REST API
    var controller = pumpControl(appConf, log4js);
    router.get('/pump', controller);
    router.put('/pump/:action?',controller);
    router.post('/pump/:action?', controller);

    // Upcoming pump schedule
    router.get('/pumpschedule', pumpSchedule(appConf, log4js));

    return router;
};

module.exports = routerFactory;
