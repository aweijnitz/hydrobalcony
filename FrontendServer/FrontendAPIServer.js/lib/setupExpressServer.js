//var appConf = require('./conf/appConfig.json');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var util = require('util');


//var log4js = require('log4js');
//log4js.configure('./conf/log4js.json');
//var logger = log4js.getLogger('app');


var setupServer = function setupServer(appConf, log4js) {
    var logger = log4js.getLogger('setupExpressServer');

    var app = express();

    logger.info('Configuring server ');
    logger.warn('SERVER IN MODE: ' + app.get('env'));


    logger.info('Configuring view engine');
    app.set('views', path.join(path.resolve(process.cwd()), 'views'));
    app.set('view engine', 'hjs');
    app.use(favicon());


    logger.info('Configuring logging engine');
    if (app.get('env') === 'development') {
        var devFormat = ':method :url - Status: :status Content-length: :content-length';
        app.use(log4js.connectLogger(log4js.getLogger("http"), { format: devFormat, level: 'auto' }));
    } else
        app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


    var webroot = path.resolve(appConf.app.webroot) || path.join(path.resolve(process.cwd()), 'public');
    logger.info('Setting webroot to ' + webroot);
    app.use(express.static(webroot));


    logger.info('Setting application routes');
    // CORS
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    var routes = require('./../routes/index');
    app.use('/', routes);

/// catch 404 and forwarding to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
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
