var later = require('later');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require("events").EventEmitter;



// Helper
var isCallback = function(callback) {
    return (!!callback && typeof callback === 'function');
};

var writeAndDrain = function writeAndDrain(tty, data, callback) {
    tty.write(data, function () {
        tty.drain(callback);
    });
};

var pump = function pump(action, tty, callback, logger) {
    if (!!tty) {
        logger.debug('Writing to serial');
        if (action)
            writeAndDrain(tty, new Buffer('rp\n', 'ascii'), function (err) {
                logger.debug('Sent command: rp');
                if(isCallback(callback))
                    callback(err);
            });
        else
            writeAndDrain(tty, new Buffer('sp\n', 'ascii'), function (err) {
                logger.debug('Sent command: sp');
                if(isCallback(callback))
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
        this.logger.warn('Multiple PumpController instances created. There can only be one!');
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
    pump(true, tty, function(err) {
        if(!!err) {
            that.logger.error('Could not start pump! err: '+util.inspect(err));
            that.emit('error', { msg: 'Start pump failed', err: err });
            if(isCallback(callback)) callback(err);
        } else {
            that.running = true;
            that.emit('start', { msg: 'Pump started' });
            that.logger.debug('Pump started.');
            if(isCallback(callback)) callback();
        }
    }, this.logger);
};

PumpController.prototype.stop = function (callback) {
    this.logger.info('Stopping pump');
    var that = this;
    pump(false, this.tty, function(err) {
        if(!!err) {
            that.logger.error('Could not stop pump! err: '+util.inspect(err));
            that.emit('error', { msg: 'Stop pump failed', err: err });
            if(isCallback(callback)) callback(err);
        } else {
            that.running = false;
            that.emit('stop', { msg: 'Pump stopped' });
            that.logger.debug('Pump stopped.');
            if(isCallback(callback)) callback();
        }
    }, this.logger);
};

PumpController.prototype.trigger = function (callback) {
    this.logger.info('Triggering pump');
    this.emit('trigger', { msg: 'Triggering pump.', duration: this.pumpInterval, time: new Date() });
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
        if(!!err) {
            that.logger.error('Could not start pump', util.inspect(err));
        } else {
            that.logger.info('Starting pump controller schedule');
            that.logger.info('Next pump run at: '+that.upcomingTimes(1));
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
        var pumpRunInterval = (appConf.app.pumpIntervalSecs * 1000) || 20*1000;
        var timeout = appConf.app.pumpTimeoutSecs * 1000 || 40*1000;
        var scheduleFile = path.resolve(appConf.app.pumpScheduleFile);
        var scheduleData = JSON.parse(fs.readFileSync(scheduleFile).toString());
        singleton = new PumpController(scheduleData, tty, pumpRunInterval, pumpRunInterval, log4js);
        return singleton;
    }
};

module.exports.PumpController = PumpController;
module.exports.getPumpController = getOrCreateController;