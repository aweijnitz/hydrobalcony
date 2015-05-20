/**
 * Rudimentary cache based on Node-module singleton
 * @type {{}}
 */

var cacheData = {};

var cache = {
    getAll: function () {
        return cacheData;
    },
    get: function (name) {
        return cacheData[name];
    },
    put: function (name, val) {
        cacheData[name] = val;
    }
};

module.exports = function (appConf, log4js) {
    var logger = log4js.getLogger("datacache");

    return cache;
};