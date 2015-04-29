var util = require('util');
var EventEmitter = require("events").EventEmitter;
var ioClient = require('socket.io-client');
var moment = require('moment');

var singleton = null;

var normalize = function (evt) {
    var timeFormat = 'YYYY-MM-DD HH:mm:ss';
//    var timeFormat = '';
    var normalized = {};
    if(!!evt.data) {
        normalized.name = evt.data[0];
        normalized.value = evt.data[1];
    }

    if(!!evt.raw && !(evt.raw instanceof Array) )
        normalized.raw = evt.raw;
    else if(!!evt.raw && (evt.raw instanceof Array) )
        normalized.raw = evt.raw[1];

    if(!!evt.time)
        normalized.timestamp = moment(evt.time).format(timeFormat);
    else
        normalized.timestamp = moment().format(timeFormat);

    if(!!evt.unit)
        normalized.unit = evt.unit;

    return normalized;
};


/**
 * Socket.io client that subscribes to sensor data from the Raspberry Pi/Arduino combo.
 * The event emitter is the ttyDataServer.js process.
 *
 * @param dataServer - host name of data server
 * @param log4js
 * @constructor
 */
var SensorDataClient = function SensorDataClient(dataServer, log4js) {
    EventEmitter.call(this);
    this.logger = log4js.getLogger('SensorDataClient');
    this.logger.debug('Creating new sensor data client');
    this.dataServer = dataServer;

    if (!!singleton)
        this.logger.warn('Multiple SensorDataClient instances created. There can only be one!');
    else
        singleton = this;
};


util.inherits(SensorDataClient, EventEmitter);

SensorDataClient.prototype.connect = function connect() {
    this.logger.debug('SensorDataClient connecting to '+'http://' + this.dataServer);
    this.socket = ioClient('http://' + this.dataServer);
    var socket = this.socket;
    var that = this;
    socket.on('connect', function () {
        that.logger.info('Connected to ' + that.dataServer);
        that.emit('connect', { endpoint: that.dataServer});
    });
    socket.on('data', function (evt) {
        //that.logger.debug('Got ' + util.inspect(evt));
        that.emit('data', normalize(evt));

    });
    socket.on('disconnect', function () {
        that.logger.info('Disconnected from ' + dataServer);
        that.emit('disconnect', { endpoint: that.dataServer});
    });
};



var getOrCreate = function getOrCreate(appConf, log4js) {
    if (!!singleton)
        return singleton;
    else {
        singleton = new SensorDataClient(appConf.app.dataServer, log4js);
        return singleton;
    }
};


module.exports.SensorDataClient = SensorDataClient;
module.exports.getSensorClient = getOrCreate;