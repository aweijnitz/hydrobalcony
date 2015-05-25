var should = require('should');
var util = require('util');

var handler = require('../lib/ttyEventHandlers/waterLevelHandler');
var moment = require('moment');

var mockLogger = require('./lib/mockLogger')(false);

describe('waterLevelHandler', function () {

    it('Should emit processed data events', function (done) {

        handler({
            data: ['waterLevel', '100'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                done();
            }
        }, mockLogger);

    });

    it('Should emit waterLevelCritical events if critical level', function (done) {

        handler({
            data: ['waterLevel', '260'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName).should.equal('waterLevelCritical');
                (evtData).should.have.property('data');
                done();
            }
        }, mockLogger.getLogger());

    });


    it('Should forward original measurement untouched as "raw"', function (done) {

        handler({
            data: ['waterLevel', '100'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('raw');
                (parseInt(evtData.raw) == 100).should.be.true;
                done();
            }
        }, mockLogger);

    });



});
