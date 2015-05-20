/**
 * This module translates the tty messages sent by the ttyDeviceHandler into socket.io events.
 * Does some minor data filtering to get rid of Bitlash welcome messages and provides optional data logging.
 */

var os = require('os');
var fs = require('fs');
var all = require('promised-io/promise').all;
var path = require('path');
var util = require('util');
var moment = require('moment');
var translatePropName = require('./util/translatePropName');
var propName = require('./util/ttyMsgParser').getPropName;
var timeStamp = require('./util/timeStamp');


var latestDataCache = null;

/**
 * Creates an event emitter instance that wraps socket.io to catch the data emitted by the handlers to add a timestamp
 * @param socketIO
 * @param timestamp
 * @param logger
 * @returns {{emit: Function}}
 */
var emitter = function emitter(socketIO, timestamp) {

    return {
        emit: function emit(eventName, eventData) {
            eventData.timestamp = timestamp;
            socketIO.emit(eventName, eventData);
            if ('data' === eventName) {
                latestDataCache.put(propName(eventData), eventData);
            }
        }
    };
};

/**
 * Look up and load event handler for ttyData and dispatch the event to the handler.
 * Also attaches a timestamp to each event.
 * The lookup is name based. See file translatePropName.js
 *
 * @param ttyData - Data event received over tty
 * @param eventEmitter - event emitter instance
 * @param logger - log4js instance
 */
var processEvent = function processEvent(ttyData, eventEmitter, logger) {

    var dataName = translatePropName(ttyData.data)[0];
    var handlerName = dataName + 'Handler.js';

    try {
        var handlerPath = path.resolve(__dirname + '/ttyEventHandlers/' + handlerName);
        var eventHandler = require(handlerPath);

        var evt = {};
        evt.data = translatePropName(ttyData.data);
        eventHandler(evt, emitter(eventEmitter, timeStamp(ttyData.time)), logger);
    } catch (e) {
        logger.error(e);
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
    latestDataCache = require('./util/dataCache')(null, log4js);

    return function dataHandler(ttyData) {
        if (ttyData && ttyData.data) {
            // Filter any garbage (ex. bitlash welcome message)
            var colonIndex = ttyData.data.indexOf(':');
            if (colonIndex < 2 || colonIndex > 3) return;

            // Log to file and forward event to event handlers
            if (!!dataFile)
                store(ttyData, dataFile);
            processEvent(ttyData, socketIO, logger);
        } else
            logger.debug('SKIPPED MESSAGE: ' + util.inspect(ttyData));
    };
};

module.exports = dataHandlerFactory;