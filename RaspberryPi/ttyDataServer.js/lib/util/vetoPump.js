var path = require('path');
var fse = require('fs-extra');


var vetoPump = function vetoPumpFactory(fileName, log4js) {
    var logger = log4js.getLogger('vetoPump');

    return function vetoPump (fileContent) {
        logger.info('Creating veto file at '+fileName);
        if(fileContent)
            fse.outputFileSync(fileName, fileContent);
        else
            fse.ensureFileSync(fileName);
    };
};


module.exports = vetoPump;
