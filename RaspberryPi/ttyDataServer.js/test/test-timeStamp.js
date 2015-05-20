var assert = require('assert');
var moment = require('moment');

var timeStamp = require('../lib/util/timeStamp');

describe('timeStamp', function () {

    it('Should attach new date if no date passed as argument', function () {
        var obj = timeStamp({});
        assert(obj.hasOwnProperty('timestamp'));
        assert(obj.timestamp instanceof Date);
    });

    it('Should attach given date, if one passed in as argument', function () {
        var d = new Date();
        var obj = timeStamp({}, d);
        assert(obj.hasOwnProperty('timestamp'));
        assert(obj.timestamp === d);
    });

    it('Should attach given date as a Date, if a Moment instance is passed in as argument', function () {
        var d = moment();
        var obj = timeStamp({}, d);
        assert(obj.hasOwnProperty('timestamp'));
        assert(obj.timestamp instanceof Date);
        assert(obj.timestamp === d.toDate());
    });

    it('Should return null for no args', function () {
        var obj = timeStamp();
        assert(obj === null);
    });

});