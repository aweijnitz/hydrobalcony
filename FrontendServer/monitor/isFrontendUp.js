#!/usr/bin/node

/**
 * Script that checks if data is being written to the sensordata table in the database.
 * Add to cron and execute every 15s.
 * 
 * This script does the following:
 * - If no new data has been written since last check
 *   1. Remove the file ./webroot/ok.html (put an external uptime monitor on 'ok.html' and get alarms if it 404:s
 *   2. Send SMS to the phone number configured in sms.json
 */

var util = require('util');
var Q = require('q');
var fse = require('fs-extra');
var path = require('path');
var moment = require('moment');
var exit = require('exit');
var request = require('superagent');

var dbConf = require('../FrontendAPIServer.js/conf/appConfig.json').app.dbStore;
var smsConf = require('./conf/smsconf.json');
var timeoutSecs = 180;

var connectDb = function (dbConf) {
    var dbHost = dbConf.host || "localhost";
    var dbPort = dbConf.port || 28015;
    var dbName = dbConf.dbName;
    var authKey = dbConf.authKey || '';
    var dbOpts = {
        host: dbHost,
        port: dbPort,
        db: dbName,
        authKey: authKey,
        buffer: 2,
        max: 5,
        timeout: 10,
        timeoutError: 2 * 1000,
        timeoutGb: 10 * 60 * 1000,
        silent: false,
        cursor: false,
        pool: true
    }; // See https://github.com/neumino/rethinkdbdash

    return require('rethinkdbdash')(dbOpts);
};


/**
 * Get latest heartbeat written in db. Returns promise.
 */
var getLatestHeartbeat = function getHeartbeat(dbConf) {
    var deferred = Q.defer();
    r = connectDb(dbConf);
    r.db(dbConf.dbName).table(dbConf.sensorTableName).orderBy({index: r.desc('timestamp')}).limit(100).filter(r.row('name').eq('heartBeat')).max('timestamp').run()
	.then(function (res) {
            deferred.resolve(res);
        })
	.error(function (err) {
            deferred.reject(new Error('Could not load sensor data. Err:' + util.inspect(err)));
        });
    return deferred.promise;
};


/**
 * Create/ensure file ok.html
 */
var okFile = __dirname + '/webroot/ok.html';
var errFile = __dirname + '/webroot/err.html';
var okHtml = function (msg) {
    var data = '';
    var t = moment().format("dddd, MMMM Do YYYY, HH:mm:ss Z");
    data = (!!msg ? '<html><head></head><body><h1>ok</h1><p>'+msg+'</p><p>'+t+'</p></body></html>' : '<html><head></head><body><h1>ok</h1><p>'+t+'</p></body></html>');
    return fse.outputFileSync(okFile, data, { encoding: 'utf8' });
};


/**
 * Remove ok file and cerate an error file. Optional error message included if available.
 */
var removeOkFile = function (msg) {
    fse.removeSync(okFile) 
    var data = '';
    data = (!!msg ? '<html><head></head><body><h1>Error</h1><p>'+msg+'</p></body></html>' : '<html><head></head><body><h1>Error</h1></body></html>');
    return fse.outputFileSync(errFile, data);
};



var sendSMS = function(msg, conf, cb) {
    request
	.post(conf.apiUrl)
	.send({ text: msg, to: conf.recipients })
	.set('Authorization', ' bearer '+conf.apiKey)
	.set('Content-Type', 'application/json')
	.set('Accept', 'application/json')
	.set('X-Version', '1')
	.end(function(err, res){
	    if (res.ok && cb) {
		cb(res)
	    } else {
		if(cb)
		    cb(res.text);
	    }
	});
};


// MAIN SCRIPT
// 1 - Read last timestamp from disk
// 2 - Compare with DB
// 3.0 - Alarm if needed
// 3.1 - Or updatetimestamp file 

okHtml();

getLatestHeartbeat(dbConf)
    .then(function dbreadOk(res) {
	var m = moment(res.timestamp);
	var delta = moment().diff(m, 'second', false);
	if(delta > timeoutSecs) {
	    // Alarm! 
	    removeOkFile('Delta: '+delta);
	    sendSMS('NO REPLY. Alert!: Hydro heartbeat overdue! ' + delta + 's', smsConf, function() { exit(2); });
	} else {
	    exit(0);
	}
	
    })
    .fail(function dbReadErr(err) {
	removeOkFile(util.inspect(err));
	sendSMS('NO REPLY. Alert! Hydro database unreachable.', smsConf, function() { exit(1); });
	
    })
    .done();

