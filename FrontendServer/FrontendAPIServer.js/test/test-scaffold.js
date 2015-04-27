var should = require('should');
var util = require('util');

describe('An empty test', function () {

    it('Should test that some function works', function (done) {
        (true).should.be.true;
        done();
    });

    it('Should test each funtionality', function (done) {
        ({ someProp: 'a value'}).should.be.ok;
        done();
    });

});
