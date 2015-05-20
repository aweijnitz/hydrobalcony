var should = require('should');
var util = require('util');

var handler = require('../lib/ttyEventHandlers/pumpCurrentHandler');
var moment = require('moment');

var mockLogger = {
    getLogger: function () {
    }
};

describe('pumpCurrentHandler', function () {

    it('Should emit processed events', function (done) {

        handler({
            data: ['pumpCurrent', '-38'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                done();
            }
        }, mockLogger);

    });


    it('Should forward current measurement untouched as "raw"', function (done) {

        handler({
            data: ['pumpCurrent', '-38'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('raw');
                (parseInt(evtData.raw) == -38).should.be.true;
                done();
            }
        }, mockLogger);

    });



    it('Should return 0 for values <= 0', function (done) {

        handler({
            data: ['pumpCurrent', '-38'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                (parseInt(evtData.data[1]) == 0).should.be.true;
                done();
            }
        }, mockLogger);

    });



    it('Should return raw value for values > 0', function (done) {

        handler({
            data: ['pumpCurrent', '38'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                (parseInt(evtData.data[1]) == 38).should.be.true;
                done();
            }
        }, mockLogger);

    });


});
