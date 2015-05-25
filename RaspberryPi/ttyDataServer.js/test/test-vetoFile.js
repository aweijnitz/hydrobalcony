var should = require('should');
var fse = require('fs-extra');
var util = require('util');
var path = require('path');

var vetoPump = require('../lib/util/vetoPump');

var mockLogger = require('./lib/mockLogger')(false);


var exists = function (file) {
    try {
        fse.statSync(file);
        return true;
    } catch (err) {
        return false;
    }
};

describe('vetoPump', function () {

    var fileName = path.resolve('../dataDir/testVeto');

    afterEach(function() {
        fse.removeSync(fileName);
    });

    it('Should create veto file if not there', function (done) {
        veto = vetoPump(fileName, mockLogger);
        veto();
        (exists(fileName)).should.be.true;
        done();
    });

    it('Should handle veto file present', function (done) {
        veto = vetoPump(fileName, mockLogger);
        veto();
        veto();
        (exists(fileName)).should.be.true;
        done();
    });

    it('Should create veto file with given content', function (done) {
        var testContent = 'test content';
        veto = vetoPump(fileName, mockLogger);
        veto(testContent);
        fse.readFile(fileName, { encoding: 'utf8' }, function(err, content) {
            if(err)
                done(err);
            else {
                content.should.equal(testContent);
                done();
            }
        });
    });


});