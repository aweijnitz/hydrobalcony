var assert = require('assert');

var mockLogger = {
    getLogger: function () {
    }
};


var cache0 = require('../lib/util/dataCache.js')({}, mockLogger);
var cache1 = require('../lib/util/dataCache.js')({}, mockLogger);

describe('dataCache', function () {

    it('Should be singleton', function () {
        assert(cache0 == cache1);
    });

    it('Should return put values regardless of where instantiated', function () {
        var testVal = 'Somedata';
        cache0.put('test', testVal);
        assert((cache1.get('test') === testVal), "Did not get expected value.");
    });
});

