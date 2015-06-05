var consoleLog = false;

var log = function (msg) {
    if (consoleLog)
        console.log('=====> ' + msg);
};

module.exports = function mockLoggerFactory(logToConsole) {
    consoleLog = !!logToConsole;
    return {
        getLogger: function () {
            return {
                debug: function (msg) {
                    log(msg);
                },
                info: function (msg) {
                    log(msg);
                },
                warn: function (msg) {
                    log(msg);
                },
                error: function (msg) {
                    log(msg);
                }
            }
        }
    };
};
