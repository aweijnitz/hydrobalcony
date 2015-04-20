var os = require('os');
var fs = require('fs');
var all = require("promised-io/promise").all;

var path = require('path');
var util = require('util');
var moment = require('moment');


var translatePropName = function (ttyData) {
    var nameVal = ttyData.split(':').map(function (item) {
        return item.trim();
    });
    switch (nameVal[0]) {
        case 'll':
            nameVal[0] = 'light'
            break;
        case 'wl':
            nameVal[0] = 'waterLevel'
            break;
        case 'wt':
            nameVal[0] = 'waterTemp'
            break;
        case 'at':
            nameVal[0] = 'airTemp'
            break;
        case 'ap':
            nameVal[0] = 'airPressure'
            break;
        default:
            break;
    }

    return nameVal;
};

var socketEmit = function socketEmit(ttyData, socketIO) {
    socketIO.emit('data', {
        data: translatePropName(ttyData.data),
        time: ttyData.time.format()
    });
};

var dataHandlerFactory = function (deviceHandler, dataLogFileName, socketIO, log4js) {
    var logger = log4js.getLogger("dataHandler");

    var dataFile = dataLogFileName;

    return function dataHandler(ttyData) {
//	logger.debug(util.inspect(ttyData));
	if(ttyData && ttyData.data) {
	    var colonIndex = ttyData.data.indexOf(':');
	    if(colonIndex < 2 || colonIndex > 3) return;
	    
            // logger.debug('Serial Event Received! - ' + ttyData.time.format() + ' - ' + ttyData.data);

            // Log to file, then send socket event
            if (!!dataFile)
		fs.appendFile(dataFile, (ttyData.time.format() + ' # ' + ttyData.data + '\n'), function (err) {
                    if (err) throw err;
                    socketEmit(ttyData, socketIO);
		});
            else
		socketEmit(ttyData, socketIO);
	} else
	    logger.debug('SKIPPED MESSAGE: '+util.inspect(ttyData));
    };
};

module.exports = dataHandlerFactory;