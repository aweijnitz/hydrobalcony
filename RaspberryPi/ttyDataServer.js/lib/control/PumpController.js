var later = require('later');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require("events").EventEmitter;

var vetoFile = path.resolve(path.join(__dirname, '../../dataDir', 'PUMP_VETO')); // Default

// Helper
var isCallback = function (callback) {
    return (!!callback && typeof callback === 'function');
};

var writeAndDrain = function writeAndDrain(tty, data, callback) {
    tty.write(data, function () {
        tty.drain(callback);
    });
};

var exists = function (file) {
    try {
        fs.statSync(file);
        return true;
    } catch (err) {
        return false;
    }
};


var isPumpVeto = function () {
    return exists(vetoFile);
};

var pump = function pump(action, tty, callback, logger) {

    if (!!tty) {
        logger.debug('Writing to serial');
        if (action) { // Run pump
            if (isPumpVeto()) {
                logger.warn('pump start, but veto file present. Pump not started!');
                if (isCallback(callback))
                    callback({msg: 'Pump run vetoed. Pump not started', veto: true, err: { msg: 'Veto file ' + vetoFile} });
            } else
                writeAndDrain(tty, new Buffer('rp\n', 'ascii'), function (err) {
                    logger.debug('Sent command: rp');
                    if (isCallback(callback))
                        callback(err);
                });
        }
        else
            writeAndDrain(tty, new Buffer('sp\n', 'ascii'), function (err) {
                logger.debug('Sent command: sp');
                if (isCallback(callback))
                    callback(err);
            });
    } else
        logger.warn('No tty found!');
};

var singleton = null;

var PumpController = function PumpController(schedule, tty, interval, timeout, log4js) {

    EventEmitter.call(this);
    this.logger = log4js.getLogger('pumpController');
    this.pumpInterval = interval;
    this.maxRun = timeout * 1000;
    this.schedule = schedule;
    this.tty = tty;
    this.running = undefined;
    // Use local time zone (UTC is default)
    later.date.localTime();
    this.logger.info('PumpController initialized');
    if (!!singleton)
        this.logger.warn('Multiple PumpController instances created. There can only be one! Skipping this instance.');
    else
        singleton = this;
};


util.inherits(PumpController, EventEmitter);


PumpController.prototype.upcomingTimes = function (nrTimes) {
    var sched = later.schedule(this.schedule);
    return (sched.next(nrTimes, new Date()));
};

PumpController.prototype.start = function (callback) {
    this.logger.info('Starting pump');
    var that = this;
    var tty = this.tty;
    pump(true, tty, function (err) {
        if (!!err) {
            that.logger.error('Could not start pump! err: ' + util.inspect(err));
            var status = {msg: 'Start pump failed', err: err};
            that.emit('error', status);
            if (isCallback(callback)) callback(status);
        } else {
            that.running = true;
            var status = {msg: 'Pump started', state: 'on'};
            that.emit('start', status);
            that.logger.debug('Pump started.');
            if (isCallback(callback)) callback(status);
        }
    }, this.logger);
};

PumpController.prototype.stop = function (callback) {
    this.logger.info('Stopping pump');
    var that = this;
    pump(false, this.tty, function (err) {
        if (!!err) {
            that.logger.error('Could not stop pump! err: ' + util.inspect(err));
            var status = {msg: 'Stop pump failed', err: err};
            that.emit('error', status);
            if (isCallback(callback)) callback(status);
        } else {
            that.running = false;
            var status = {msg: 'Pump stopped', state: 'off'};
            that.emit('stop', status);
            that.logger.debug('Pump stopped.');
            if (isCallback(callback)) callback(status);
        }
    }, this.logger);
};

PumpController.prototype.trigger = function (callback) {
    this.logger.info('Triggering pump');
    this.emit('trigger', {msg: 'Triggering pump.', duration: this.pumpInterval, time: new Date()});
    var that = this;
    this.start(function triggerJob(err) {
        setTimeout(function stopJob() {
            that.stop(callback);
        }, that.pumpInterval);
    });
};


PumpController.prototype.run = function () {

    // First, make sure we are in a known state (stopped)
    var that = this;
    this.logger.debug('Stopping pump');
    this.stop(function startSchedule(err) {
        if (!!err) {
            that.logger.error('Could not start pump', util.inspect(err));
        } else {
            that.logger.info('Starting pump controller schedule');
            that.logger.info('Next pump run at: ' + that.upcomingTimes(1));
            that.scheduleId = later.setInterval(function triggerJob() {
                that.trigger();
            }, that.schedule);
        }
    });
};


/**
 * Module entry point. Manages singleton controller instance.
 * @param appConf
 * @param log4j
 * @returns PumpController singleton instance
 */
var getOrCreateController = function getOrCreateController(appConf, log4js, tty) {
    if (!!singleton)
        return singleton;
    else {
        var pumpRunInterval = (appConf.app.pumpIntervalSecs * 1000) || 20 * 1000;
        var timeout = appConf.app.pumpTimeoutSecs * 1000 || 40 * 1000;
        var scheduleFile = path.resolve(appConf.app.pumpScheduleFile);
        vetoFile = path.resolve(appConf.app.vetoFile);
        var scheduleData = JSON.parse(fs.readFileSync(scheduleFile).toString());
        singleton = new PumpController(scheduleData, tty, pumpRunInterval, pumpRunInterval, log4js);

        // Enable hot reload for schedule conf file
        fs.watch(scheduleFile, {persistent: true, recursive: false}, function (event, filename) {
            var logger = log4js.getLogger('pumpFileWatch');
            logger.info('Reloading schedule config file from ' + filename);
            var scheduleData = JSON.parse(fs.readFileSync(scheduleFile).toString());
            singleton = null;
            singleton = new PumpController(scheduleData, tty, pumpRunInterval, pumpRunInterval, log4js);
        });

        return singleton;
    }
};

module.exports.PumpController = PumpController;
module.exports.getPumpController = getOrCreateController;