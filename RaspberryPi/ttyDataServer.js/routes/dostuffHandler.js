var util = require('util');

var handleDoStuff = function(appConf, log4js) {
    var logger = log4js.getLogger("dostuff");

    // Local conf

    return function dostuffHandler (req, res) {
        logger.debug("dostuffHandler says hello!")
        logger.debug(util.inspect(req.body));
        //res.end(util.inspect(req.body));
        res.render('dostuff', { commandResponse: 'Command response here' });
    };
};

module.exports = handleDoStuff;
