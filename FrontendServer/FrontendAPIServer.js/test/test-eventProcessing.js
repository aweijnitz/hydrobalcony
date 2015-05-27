var should = require('should');
var util = require('util');

var ensureFloat = require('../lib/util/eventProcessing').ensureFloat;

describe('eventProcessing', function () {
    var floatValuedSensors = ['lightLevel','waterLevel','waterTemp','airTemp','airPressure'];

    it('Should leave events unouched if not float valued', function (done) {
        var data = ['somePropName', '10'];
        (typeof ensureFloat(data, floatValuedSensors)[1] === 'string').should.be.true;
        done();
    });

    it('Should convert events if float valued', function (done) {
        var data = ['waterLevel', '10'];
        (typeof ensureFloat(data, floatValuedSensors)[1] === 'number').should.be.true;
        done();
    });

    it('Should convert events if float valued, even if float valued to begin with', function (done) {
        var data = ['waterLevel', 10.0];
        (typeof ensureFloat(data, floatValuedSensors)[1] === 'number').should.be.true;
        done();
    });


});
