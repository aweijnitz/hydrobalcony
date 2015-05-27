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
            data: ['pumpCurrent', '38'],
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
            data: ['pumpCurrent', '38'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('raw');
                (parseInt(evtData.raw)).should.equal(38);
                done();
            }
        }, mockLogger);

    });



    it('Should return 0 for values <= 0', function (done) {

        var result = handler({
            data: ['pumpCurrent', '-38'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
            }
        }, mockLogger);

        result[1].should.equal(0);
        done();
    });



    it('Should return raw value for values > 0', function (done) {

        handler({
            data: ['pumpCurrent', '38'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                (parseInt(evtData.data[1])).should.equal(38);
                done();
            }
        }, mockLogger);

    });


});
