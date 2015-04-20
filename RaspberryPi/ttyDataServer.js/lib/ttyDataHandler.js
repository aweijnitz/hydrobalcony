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
        case 'pc':
            nameVal[0] = 'pumpCurrent'
            break;
        case 'hb':
            nameVal[0] = 'heartBeat'
            break;

        default:
            break;
    }

    return nameVal;
};

var processEvent = function processEvent(ttyData, socketIO) {
    socketIO.emit('data', {
        data: translatePropName(ttyData.data),
        time: ttyData.time.format()
    });
};

var logBuffer = [];
var store = function storeData (ttyData, dataFile) {
    logBuffer.push(ttyData.time.format() + ' # ' + ttyData.data);
    if(logBuffer.length > 1200) // Buffer ca. 4-5 minutes of messages
	fs.appendFile(dataFile, logBuffer.join('\n'), function (err) {
            if (err) throw err;
	});  
    
    logBuffer = []; // clear buffer
};

var dataHandlerFactory = function (deviceHandler, dataLogFileName, socketIO, log4js) {
    var logger = log4js.getLogger("dataHandler");

    var dataFile = dataLogFileName;

    return function dataHandler(ttyData) {
//	logger.debug(util.inspect(ttyData));
	if(ttyData && ttyData.data) {
	    // Filter any garbage (ex. bitlash welcome message)
	    var colonIndex = ttyData.data.indexOf(':');
	    if(colonIndex < 2 || colonIndex > 3) return;
	    
            // logger.debug('Serial Event Received! - ' + ttyData.time.format() + ' - ' + ttyData.data);

            // Log to file and send socket event
            if (!!dataFile)
		store(ttyData, dataFile);
	    processEvent(ttyData, socketIO);
	} else
	    logger.debug('SKIPPED MESSAGE: '+util.inspect(ttyData));
    };
};

module.exports = dataHandlerFactory;