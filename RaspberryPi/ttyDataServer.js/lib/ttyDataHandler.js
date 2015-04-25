var os = require('os');
var fs = require('fs');
var all = require('promised-io/promise').all;

var path = require('path');
var util = require('util');
var moment = require('moment');

var translatePropName = require('./translatePropName');

var latestDataCache = null;

/**
 * This creates an event emitter instance that wraps socket.io to catch the data emitted by the handlers
 * @param socketIO
 * @param logger
 * @returns {{emit: Function}}
 */
var emitter = function emitter(socketIO, logger) {
    // Helper
    var getPropName = function (evtData) {
        return evtData.data[0];
    };

    return {
        emit: function emit(eventName, eventData) {
            //logger.debug('EMIT', eventName, eventData);
            socketIO.emit(eventName, eventData);
            if ('data' === eventName) {
                // pickup and cache latest processed data
                latestDataCache.put(getPropName(eventData), eventData);
            }
        }
    };
};

/**
 * Look up and load event handler for ttyData and dispatch the event to the handler.
 * The lookup is name based. See file translatePropName.js
 *
 * @param ttyData - Data event received over tty
 * @param eventEmitter - event emitter instance
 * @param logger - log4js instance
 */
var processEvent = function processEvent(ttyData, eventEmitter, logger) {

    var dataName = translatePropName(ttyData.data)[0];
    var handlerName = dataName + 'Handler';

    try {
	var result = require('./ttyEventHandlers/' + handlerName)({
            data: translatePropName(ttyData.data),
            time: ttyData.time
	}, eventEmitter, logger);
    } catch(e) {
	logger.error('No handler found for '+dataName);
    }

};

var logBuffer = [];
var store = function storeData(ttyData, dataFile) {
    logBuffer.push(ttyData.time.format() + ' # ' + ttyData.data);
    if (logBuffer.length > 1200) // Buffer ca. 4-5 minutes of messages
        fs.appendFile(dataFile, logBuffer.join('\n'), function (err) {
            if (err) throw err;
        });

    logBuffer = []; // clear buffer
};

/**
 * Factory function. Returns the data handler.
 *
 * @param deviceHandler - The tty object binding to the serial port
 * @param dataLogFileName - Incoming data is logged
 * @param socketIO
 * @param log4js
 * @returns {Function}
 */
var dataHandlerFactory = function (deviceHandler, dataLogFileName, socketIO, log4js) {
    var logger = log4js.getLogger("dataHandler");
    var dataFile = dataLogFileName;
    latestDataCache = require('../lib/dataCache')(null, log4js);

    return function dataHandler(ttyData) {
        if (ttyData && ttyData.data) {
            // Filter any garbage (ex. bitlash welcome message)
            var colonIndex = ttyData.data.indexOf(':');
            if (colonIndex < 2 || colonIndex > 3) return;

            // Log to file and forward event to event handlers
            if (!!dataFile)
                store(ttyData, dataFile);
            processEvent(ttyData, emitter(socketIO, logger), logger);
        } else
            logger.debug('SKIPPED MESSAGE: ' + util.inspect(ttyData));
    };
};

module.exports = dataHandlerFactory;