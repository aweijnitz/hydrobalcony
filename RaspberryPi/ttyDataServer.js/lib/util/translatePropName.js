/** This module just translates between raw (short!) data names and more human readable names.
 * The names are used in the socket.io events and they are used to look up the corresponding
 * event handlers in ttyEventHandlers/
 *
 * See https://github.com/aweijnitz/hydrobalcony/blob/master/RaspberryPi/bitlash/bitlash-functions.txt
 *
 * Example: 'll:321' -> ['lightLevel', 321] -> Handler: ttyEventHandlers/lightLevelHandler.js
 */

var parseData = require('./ttyMsgParser').parseTTYdata;

var translatePropName = function (ttyData) {
    var nameVal = parseData(ttyData);
    if (!nameVal) return null;

    switch (nameVal[0]) {
        case 'll':
            nameVal[0] = 'lightLevel'
            break;
        case 'wl':
            nameVal[0] = 'waterLevel'
            break;
        case 'wt':
            nameVal[0] = 'waterTemp'
            break;
        case 'at':
            nameVal[0] = 'airTemp'
            break;
        case 'ap':
            nameVal[0] = 'airPressure'
            break;
        case 'pc':
            nameVal[0] = 'pumpCurrent'
            break;
        case 'hb':
            nameVal[0] = 'heartBeat'
            break;

        default:
            break;
    }

    return nameVal;
};

exports = module.exports = translatePropName;
