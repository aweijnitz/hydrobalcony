var should = require('should');
var util = require('util');
var fse = require('fs-extra');
var path = require('path');

var PumpController = require('../lib/control/PumpController').PumpController;
var ttyDeviceHandler = require('../lib/ttyDeviceHandler.js');


var vetoFile = path.resolve(path.join(__dirname, '../dataDir', 'PUMP_VETO'));

var consoleLog = false;

var log = function (msg) {
    if (consoleLog)
        console.log('=====> ' + msg);
};

var mockLogger = {
    getLogger: function () {
        return {
            debug: function (msg) {
                log(msg);
            },
            info: function (msg) {
                log(msg);
            },
            warn: function (msg) {
                log(msg);
            },
            error: function (msg) {
                log(msg);
            }
        }
    }
};


var mockSocketIO = {
    emit: function (evt) {
    }
};


// Test scaffolds
var schedule = {
    schedules: [
        {m: [0, 20, 40]}
    ],
    exceptions: [
        {h_a: [20]},
        {h_b: [6]}
    ]
};

var tty = new ttyDeviceHandler('/dev/tty.MockSerial', 100, 100);
var pumpInterval = 10;
var timeout = 40;

describe('PumpControl', function () {
    var ctrl;

    beforeEach(function () {
        ctrl = new PumpController(schedule, tty, pumpInterval, timeout, mockLogger);
        fse.removeSync(vetoFile);
    });

    it('Should be able to instantiate', function (done) {
        ctrl.should.be.ok;
        tty.should.be.ok;
        (ctrl.tty).should.equal(tty);
        done();
    });

    it('start should emit event', function (done) {
        ctrl.on('start', function (evtData) {
            evtData.should.be.ok;
            evtData.msg.should.exist;
            evtData.msg.should.equal('Pump started');
            done();
        });
        ctrl.start();
    });


    it('stop should invoke callback', function (done) {
        ctrl.stop(function () {
            done();
        });
    });

    it('start should invoke callback with pump status', function (done) {
        ctrl.stop(function (status) {
            (!!status).should.be.true;
            (status.state).should.equal('off');
            done();
        });
    });


    it('start should invoke callback', function (done) {
        ctrl.start(function () {
            done();
        });
    });

    it('start should invoke callback with pump status', function (done) {
        ctrl.start(function (status) {
            (!!status).should.be.true;
            (status.state).should.equal('on');
            done();
        });
    });

    it('PUMP_VETO file should prevent pump start', function (done) {
        consoleLog = false;
        fse.ensureFileSync(vetoFile);
        ctrl.on('error', function() { // dummy
         });
        ctrl.start(function (status) {
            (!!status).should.be.true;
            (status.err.veto).should.exist;
            (status.err.veto).should.be.true;
            consoleLog = false;

            done();
        });
    });


    it('stop should emit event', function (done) {
        ctrl.on('stop', function (evtData) {
            evtData.should.be.ok;
            evtData.msg.should.exist;
            evtData.msg.should.equal('Pump stopped');
            done();
        });
        ctrl.stop();
    });

    it('Should do start then stop when triggering', function (done) {
        (ctrl.pumpInterval == pumpInterval).should.be.true;
        ctrl.trigger(function () {
            done();
        });
    });

});
