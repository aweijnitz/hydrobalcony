

var processData = function(eventData) {
    return [eventData[0], parseFloat((eventData[1]/1000).toFixed(1))];
};

/**
 * eventData - object with props 'data' and 'time'. data is an array with prop name and value. time is a moment() instance.
 * emitter - instance to emit() data events on
 * logger - log4js logger instance for logging
 */
var handler = function (eventData, emitter, logger) {
    emitter.emit('data', {
        data: processData(eventData.data),
        unit: 'C',
        raw: eventData.data[1]
    });
};

exports = module.exports = handler;
