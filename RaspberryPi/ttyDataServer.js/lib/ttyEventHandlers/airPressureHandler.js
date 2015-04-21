
/**
 * eventData - object with props 'data' and 'time'. data is an array with prop name and value. time is a moment() instance.
 * socketIO - socket.io instance to emit events on
 * logger - log4js logger instance for logging
 */
var handler = function (eventData, socketIO, logger) {
    socketIO.emit('data', {
        data: eventData.data,
        time: eventData.time.format(),
        unit: 'mBar'
    });
};

exports = module.exports = handler;
