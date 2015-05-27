


var ensureFloat = function (data, floatValuedSensorNames) {
    var sensorName = data[0];
    var value = data[1]
    if(floatValuedSensorNames.indexOf(sensorName) >= 0)
        return [sensorName, parseFloat(value)];
    return data; // return untouched
}


exports = module.exports.ensureFloat = ensureFloat;