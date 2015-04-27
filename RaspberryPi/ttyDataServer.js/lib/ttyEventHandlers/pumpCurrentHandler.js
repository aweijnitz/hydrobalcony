

var processData = function(eventData) {
    return [eventData[0], (eventData[1] > 0 ? eventData[1] : 0)];
};


/**
 * eventData - object with props 'data' and 'time'. data is an array with prop name and value. time is a moment() instance.
 * emitter - instance to emit() data events on
 * logger - log4js logger instance for logging
 */
var handler = function (eventData, emitter, logger) {
    emitter.emit('data', {
        data: processData(eventData.data),
        raw: eventData.data[1],
        time: eventData.time.format(),
        unit: 'mA'
    });
};

exports = module.exports = handler;
