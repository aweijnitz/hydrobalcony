var os = require('os');
var fs = require('fs');
var all = require('promised-io/promise').all;

var path = require('path');
var util = require('util');
var moment = require('moment');

var translatePropName = require('./translatePropName');

/**
 * Look up and load event handler for ttyData and dispatch the event to the handler.
 * The lookup is name based. See file translatePropName.js
 *
 * @param ttyData - Data event received over tty
 * @param socketIO - Socket.io instance
 * @param logger - log4js instance
 */
var processEvent = function processEvent(ttyData, socketIO, logger) {

    var dataName = translatePropName(ttyData.data)[0];
    var handlerName = dataName + 'Handler';
//    logger.debug('Invoking handler by name: '+handlerName);
    var handler = require('./ttyEventHandlers/'+handlerName)({
        data: translatePropName(ttyData.data),
        time: ttyData.time
    }, socketIO, logger);

    /*
    socketIO.emit('data', {
        data: translatePropName(ttyData.data),
        time: ttyData.time.format()
    });
    */
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
	    processEvent(ttyData, socketIO, logger);
	} else
	    logger.debug('SKIPPED MESSAGE: '+util.inspect(ttyData));
    };
};

module.exports = dataHandlerFactory;