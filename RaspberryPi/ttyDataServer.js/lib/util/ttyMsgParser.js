module.exports.getPropName = function getPropName(evtData) {
    if (evtData && evtData.hasOwnProperty('data'))
        return evtData.data[0];
    return null;
};

module.exports.getValue = function getValue(evtData) {
    if (evtData && evtData.hasOwnProperty('data'))
        return evtData.data[1];
    return null;
};

module.exports.parseTTYdata = function parseTTYdata(ttyData) {
    if (ttyData && ttyData.length > 3 && ttyData.indexOf(':') > 0)
        return ttyData.split(':').map(function (item) {
            return item.trim();
        });
    return null;
};
