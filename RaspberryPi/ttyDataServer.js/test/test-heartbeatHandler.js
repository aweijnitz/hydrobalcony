var should = require('should');
var util = require('util');

var handler = require('../lib/ttyEventHandlers/heartBeatHandler');
var moment = require('moment');

var mockLogger = {
    getLogger: function () {
    }
};

describe('heartBeatHandler', function () {

    it('Should emit processed events', function (done) {

        handler({
            data: ['heartBeat', '8241728364293674'],
            time: moment()
        }, {
            emit: function (evtName, evtData) {
                (evtName === 'data').should.be.true;
                (evtData).should.have.property('data');
                (evtData).should.have.property('time');
                (evtData).should.have.property('raw');

                done();
            }
        }, mockLogger);

    });

});
