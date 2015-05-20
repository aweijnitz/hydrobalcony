var assert = require('assert');

var translate = require('../lib/util/translatePropName');
var ttyData =  'wl:14.1';

describe('translatePropName', function () {

    it('Should translate short tty name to human public API name (longer name)', function () {
        // Note: I don't see a need to test ALL names, just the basic functionality will do.
        assert(translate(ttyData)[0] === 'waterLevel');
    });

    it('Should return null for broken tty messages', function () {
        assert(translate('gibberish') == null);
        assert(translate('') == null);
        assert(translate() == null);
    });

});