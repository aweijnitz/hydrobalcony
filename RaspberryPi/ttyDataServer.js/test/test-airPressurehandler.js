var should = require('should');
var util = require('util');

var handler = require('../lib/ttyEventHandlers/airPressureHandler');
var moment = require('moment');

var mockLogger = require('./lib/mockLogger')(false);

describe('airPressureHandler', function () {

    it('Should emit processed data events', function (done) {

        handler({
            data: ['airPressure', '10'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                done();
            }
        }, mockLogger);

    });


    it('Should emit processed data events should be of type `number`', function (done) {

        handler({
            data: ['airPressure', '10'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                (typeof evtData.data[1] === 'number').should.be.true;
                done();
            }
        }, mockLogger);

    });


    it('Should forward original measurement untouched as "raw"', function (done) {

        handler({
            data: ['airPressure', '10'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('raw');
                (parseInt(evtData.raw) == 10).should.be.true;
                done();
            }
        }, mockLogger);

    });




});
