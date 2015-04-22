var appConf = require('../conf/appConfig.json');




// Load route handlers (doubling as rudimentary MVC controllers)
var rawLogHandler = require('./rawlog');
var latestDataHandler = require('./latestDataHandler');



var routerFactory = function router(appConf, log4js, router) {
    var logger = log4js.getLogger("index");

    // Remember, in Express 4, '/' is the root under which this route is mounted, so does not
    // necessarily correspond to the absolute root of the domain.
    //
    router.get('/', function (req, res) {
        logger.debug('Serving / --> index.hjs');
        res.render('index', {dummy: 'Hydroino Dream Balcony'});
    });

    // Note: the data cache is setup when
    router.get('/latestdata', latestDataHandler(appConf, log4js));

    router.get('/rawlog', rawLogHandler(appConf, log4js));


    return router;
};

module.exports = routerFactory;
