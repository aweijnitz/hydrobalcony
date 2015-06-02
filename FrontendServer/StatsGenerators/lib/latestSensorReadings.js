module.exports = function latestTemp(r, sensorName, timeWindow, resultHandler, log4js) {
    return function (conn) {
        r.db('hydro').table('sensordata')
            .orderBy({index: r.desc('timestamp')})
            .filter(r.row('timestamp').during(r.now()
                .add(-1 * timeWindow), r.now()).and(r.row('name').eq(sensorName)))
            .pluck(['timestamp', 'value'])
            .run(conn, function (err, cursor) {
                resultHandler(err, cursor, conn);
            });
    };
};
