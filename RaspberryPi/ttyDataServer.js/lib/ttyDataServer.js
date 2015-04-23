var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('static-favicon');


/**
 * Configuration and creation of the Express 4 HTTP server.
 * The server exposes a simple UI and some REST APIs.
 *
 * @param appConf - System config from /conf/appConf.json
 * @param log4js - log4js instance
 * @returns app - Configured Express 4 app (not listening)
 */
var setupServer = function setupServer(appConf, log4js) {
    var logger = log4js.getLogger('server');

    var app = express();
    app.use(bodyParser.text({ type: 'text/plain' }));

    logger.info('Configuring server ');
    logger.warn('SERVER IN MODE: ' + app.get('env'));


    logger.info('Configuring view engine');
//    app.set('views', path.join('..', 'views'));
    logger.debug('views in: ',path.resolve('views'));
    app.set('views', path.resolve('views'));
    app.set('view engine', 'hjs');
    app.use(favicon());


    logger.info('Configuring logging engine');
    if (app.get('env') === 'development') {
        var devFormat = ':method :url - Status: :status Content-length: :content-length';
        app.use(log4js.connectLogger(log4js.getLogger("http"), {format: devFormat, level: 'auto'}));
    } else
        app.use(log4js.connectLogger(log4js.getLogger("http"), {level: 'auto'}));


    var webroot = appConf.app.webroot || path.join(__dirname, 'public');
    logger.info('Setting webroot to ' + webroot);
    app.use(express.static(webroot));


    logger.info('Setting application routes');
    var routes = require('../routes/index')(appConf, log4js, express.Router());
    app.use('/', routes);

/// catch 404 and forwarding to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        //logger.debug(util.inspect(req));
        next(err);
    });

/// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


    return app;
};


module.exports = setupServer;
