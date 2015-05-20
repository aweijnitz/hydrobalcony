/**
 * Basic helper to add timestamps to all events going out.
 * @type {Function}
 */
exports = module.exports = function timeStamp(obj, date) {
    if (!obj)
        return null;

    if(!date)
        obj.timestamp = new Date();
    else if (date instanceof Date)
        obj.timestamp = date;
    else if (!!date.toDate)
        obj.timestamp = date.toDate();

    return obj;

};


