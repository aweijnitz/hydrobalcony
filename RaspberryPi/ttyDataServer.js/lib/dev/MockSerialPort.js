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


module.exports = MockSerialPort;