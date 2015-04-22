var should = require('should');
var util = require('util');

var ttyDataHandler = require('../lib/ttyDataHandler.js');
var moment = require('moment');

var mockLogger = {
    getLogger: function () {
    }
};

var mockSocketIO = {
    emit: function (evt) {
    }
};

describe('ttyDataHandler', function () {

    it('Factory function should return a function', function (done) {
        var f = ttyDataHandler({}, 'logFile', mockSocketIO, mockLogger);
        (typeof f === 'function').should.be.true;
        done();
    });

    it('Handler function should emit events', function (done) {
        var handler = ttyDataHandler({}, null, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                (evtData).should.have.property('time');

                done();
            }
        }, mockLogger);
        (typeof handler === 'function').should.be.true;
        handler({
            data: 'hb:1239735345',
            time: moment()
        })

    });

});
