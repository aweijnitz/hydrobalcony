var EMPTY_LEVEL_RAW = 262; // Note: Fluctuating readings. Have seen 266 as well on empty
var CRITICAL_LEVEL = 3.5;

var processData = function (eventData) {
    return [eventData[0], parseFloat(((EMPTY_LEVEL_RAW - eventData[1])) / 10.0.toFixed(1))];
};

/**
 * eventData - object with props 'data' and 'time'. data is an array with prop name and value. time is a moment() instance.
 * emitter - instance to emit() data events on
 * logger - log4js logger instance for logging
 */
var handler = function (eventData, emitter, logger) {
    var processed = processData(eventData.data);
    var payload = {
        data: processed,
        unit: 'cm',
        raw: eventData.data[1]
    };

    if(processed[1] <= CRITICAL_LEVEL) {
        logger.warn('WATER LEVEL CRITICAL: ' + processed[1]);
        emitter.emit('waterLevelCritical', payload);
    } else
        emitter.emit('data', payload);

};

exports = module.exports = handler;
