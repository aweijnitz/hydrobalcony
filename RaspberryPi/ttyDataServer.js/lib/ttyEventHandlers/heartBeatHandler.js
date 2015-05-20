var moment = require('moment');


var processData = function(eventData) {

    //console.log('HB HANDLER: '+eventData[1]);
    var d = moment.duration(parseInt(eventData[1]));

    return [eventData[0],
        d.days() + ' days, ' +
        d.hours() + ' hours, ' +
        d.minutes() + ' minutes, ' +
        d.seconds() + ' seconds'];
};


/**
 * eventData - object with props 'data' and 'time'. data is an array with prop name and value. time is a moment() instance.
 * emitter - instance to emit() data events on
 * logger - log4js logger instance for logging
 */
var handler = function (eventData, emitter, logger) {
    emitter.emit('data', {
        data: processData(eventData.data),
        raw: eventData.data,
        unit: ''
    });
};

exports = module.exports = handler;
