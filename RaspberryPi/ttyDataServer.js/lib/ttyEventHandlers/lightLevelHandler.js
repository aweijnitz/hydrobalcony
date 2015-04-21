
var MAX_SEEN_RAW = 566.0;


var processData = function(eventData) {
    return [eventData.data[0], (100.0*eventData.data/MAX_SEEN_RAW).toFixed(1)];
};

/**
 * eventData - object with props 'data' and 'time'. data is an array with prop name and value. time is a moment() instance.
 * socketIO - socket.io instance to emit events on
 * logger - log4js logger instance for logging
 */
var handler = function (eventData, socketIO, logger) {
    socketIO.emit('data', {
        data: processData(eventData),
        time: ttyData.time.format(),
        unit: '%'
    });
};

exports = module.exports = handler;
