var should = require('should');
var util = require('util');

var PumpController = require('../lib/control/PumpController').PumpController;
var ttyDataHandler = require('../lib/ttyDataHandler.js');


var mockLogger = {
    getLogger: function () {
        return {
            debug: function() {},
            info: function() {},
            warn: function() {},
            error: function() {}
        }
    }
};


var mockSocketIO = {
    emit: function (evt) {
    }
};


// Test scaffolds
var schedule = {
    schedules:
        [
            { m: [0, 20, 40]}
        ],
    exceptions:
        [
            { h_a: [20] },
            { h_b: [6] }
        ]
};

var tty = ttyDataHandler({}, 'logFile', mockSocketIO, mockLogger);
var pumpIntervalSecs = 20;
var pumpForceStopAfterSecs = 40;

describe('An empty test', function () {
    var ctrl;

    before(function() {
        ctrl = new PumpController(schedule, tty, pumpIntervalSecs, pumpForceStopAfterSecs, mockLogger);
    });

    it('Should be able to instantiate', function (done) {
        (ctrl.tty).should.equal(tty);
        done();
    });

    it('Should start', function (done) {
        ctrl.on('start', done);
        ctrl.start();
    });

});
