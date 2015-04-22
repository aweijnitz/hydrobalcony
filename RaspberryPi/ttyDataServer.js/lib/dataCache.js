var cache = {};

module.exports = function (appConf, log4js) {
    var logger = log4js.getLogger("datacache");

    return {
        getAll: function () {
            //logger.debug('GETALL');
            return cache;
        },
        get: function (name) {
            return cache[name];
        },
        put: function (name, val) {
            //logger.debug('PUT', name, val);
            cache[name] = val;
        }
    };
};