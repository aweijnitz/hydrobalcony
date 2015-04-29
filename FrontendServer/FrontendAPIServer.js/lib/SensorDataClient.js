var util = require('util');
var EventEmitter = require("events").EventEmitter;
var ioClient = require('socket.io-client');

var singleton = null;


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
        that.logger.debug('Got ' + util.inspect(evt));
        that.emit('data', evt);

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