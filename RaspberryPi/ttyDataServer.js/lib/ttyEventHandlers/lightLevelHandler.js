
var MAX_SEEN_RAW = 566.0;


var processData = function(eventData) {
    return [eventData[0], parseFloat((100.0*eventData[1]/MAX_SEEN_RAW).toFixed(1))];
};

/**
 * eventData - object with props 'data' and 'time'. data is an array with prop name and value. time is a moment() instance.
 * emitter - instance to emit() data events on
 * logger - log4js logger instance for logging
 */
var handler = function (eventData, emitter, logger) {
    emitter.emit('data', {
        data: processData(eventData.data),
        unit: '%',
        raw: eventData.data[1]
    });
};

exports = module.exports = handler;
