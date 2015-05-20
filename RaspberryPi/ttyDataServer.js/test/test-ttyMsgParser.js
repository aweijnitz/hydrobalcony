var assert = require('assert');
var moment = require('moment');

var propName = require('../lib/util/ttyMsgParser').getPropName;
var getValue = require('../lib/util/ttyMsgParser').getValue;
var parseData = require('../lib/util/ttyMsgParser').parseTTYdata;

var testMsg = { data: ['wl', '14.1'], time: moment()};
var ttyData =  'wl:14.1';

describe('ttyMsgParser', function () {

    it('Should return prop name', function () {
        assert(propName(testMsg) === 'wl');
    });


    it('Should return null for uparsable name', function () {
        assert(propName({}) === null);
    });


    it('Should return value name', function () {
        assert(getValue(testMsg) === '14.1');
    });

    it('Should return null for uparsable value', function () {
        assert(getValue({}) === null);
    });


    it('Should parse tty msg', function () {
        assert(parseData(ttyData).length == 2);
    });

    it('Should return null for unprasable message', function () {
        assert(parseData('') == null);
        assert(parseData() == null);
        assert(parseData('gibberish') == null);
    });

});