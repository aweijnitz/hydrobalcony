var util = require('util');
var EventEmitter = require("events").EventEmitter;
var ioClient = require('socket.io-client')

var singleton = null;


var SensorDataClient = function SensorDataClient(dataServer, log4js) {
    EventEmitter.call(this);
    this.logger = log4js.getLogger('SensorDataClient');
    this.dataServer = dataServer;

    if (!!singleton)
        this.logger.warn('Multiple SensorDataClient instances created. There can only be one!');
    else
        singleton = this;
};


util.inherits(SensorDataClient, EventEmitter);

SensorDataClient.prototype.connect = function connect() {
    this.io = ioClient('http://' + this.dataServer);
    var that = this;
    socket.on('connect', function () {
        that.logger.info('Connected to ' + that.dataServer);
        that.emit('connect', { endpoint: that.dataServer});
    });
    socket.on('event', function (evt) {
        that.logger.debug('Got to ' + util.inspect(evt));
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
        singleton = new SensorDataClient(appConf, log4js);
        return singleton;
    }
};


module.exports.SensorDataClient = SensorDataClient;
module.exports.getSensorClient = getOrCreate;