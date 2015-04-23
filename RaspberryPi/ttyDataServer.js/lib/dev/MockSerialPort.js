var util = require("util");
var EventEmitter = require("events").EventEmitter;


var MockSerialPort = function (dataEvent, delay) {
    that = this;
    process.nextTick(function () {
        that.emit('open', true);
        that.timerId = setInterval(function() {
            that.emit('data', dataEvent());
        },  delay );
    });
};

util.inherits(MockSerialPort, EventEmitter);


MockSerialPort.prototype.stop = function () {
    clearInterval(this.timerId);
};

MockSerialPort.prototype.close = function (cb) {
    this.stop();
    if (typeof cb === 'function') cb();
};


MockSerialPort.prototype.drain = function (cb) {
    if (typeof cb === 'function') cb();
};


MockSerialPort.prototype.write = function (buffer, cb) {
    if (typeof cb === 'function') cb();
};

module.exports = MockSerialPort;