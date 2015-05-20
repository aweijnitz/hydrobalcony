var util = require("util");
var EventEmitter = require("events").EventEmitter;
var moment = require('moment');
var MockSerial = require("./dev/MockSerialPort");
var mockDataGenerator = require('./dev/mockSerialData');


/**
 * Workaround to allow cross-platform development. Returns fake serial port object.
 */
var mockSerialPort = function fakeSerialPort() {
    return new MockSerial(mockDataGenerator, 500);
};


/**
 * Binds to serial device. Emits 'data' event for incoming data.
 * @param device
 * @param baudrate
 * @param bufferSize
 * @constructor
 */
var SerialPortHandler = function (device, baudrate, bufferSize) {

    EventEmitter.call(this);

    var serialPort = null;
    var openImmediately = true;

    if (device === '/dev/tty.MockSerial')
        serialPort = mockSerialPort();
    else {
        var SerialPort = require("serialport").SerialPort;
        var SerialPortLib = require("serialport");

        serialPort = new SerialPort(device, {
            baudrate: (baudrate || 9600 ),
            buffersize: (bufferSize || 128),
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            parser: SerialPortLib.parsers.readline("\n"),
            flowControl: false
        }, openImmediately);
    }

    this.tty = serialPort;
    this.latestData = null;
    this.state = 'ready';
    var that = this;
    serialPort.on("open", function () {
        that.state = 'open';
        serialPort.on('data', function (data) {
            that.latestData = data;
            that.emit('data', {data: data.toString('ascii'), time: moment()});
        });
        serialPort.on('close', function (err) {
            that.state = 'closed';
            that.emit('close', err);
        });
        serialPort.on('error', function (err) {
            that.state = 'error';
            that.emit('error', err);
        });
	that.emit('open', { state: 'open'});
    });
};

util.inherits(SerialPortHandler, EventEmitter);

SerialPortHandler.prototype.getLatestData = function () {
    return this.latestData;
};


SerialPortHandler.prototype.getStatus = function () {
    return this.status;
};


SerialPortHandler.prototype.close = function (cb) {
    if (typeof cb === 'function')
        this.tty.close(cb);
    else
        this.tty.close();
};


SerialPortHandler.prototype.drain = function (cb) {
    if (typeof cb === 'function')
        this.tty.drain(cb);
    else
        this.tty.drain();
};


SerialPortHandler.prototype.write = function (buffer, cb) {
    //process.stdout.write('SerialPortHandler -> SERIAL::WRITE ' + buffer.toString() + '\n');
    this.tty.write(buffer, cb);
};

module.exports = SerialPortHandler;