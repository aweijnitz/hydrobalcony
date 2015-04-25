(function UIapp($) {
    var log = function (msg) {
        console.log(msg);
    };

    var renderValue = function (dataName, value, unit) {
        $('#' + dataName).html(value + '&nbsp;' + unit);
    };

    var subscribe = function () {
        var socket = io.connect();
        socket.on('data', function (data) {
            renderValue(data.data[0], data.data[1], data.unit);
        });
        socket.on('pump', function (data) {
            renderValue('pumpState', data.state, '');
        });

    };

    $.getJSON('/latestdata', function then(data) {
        $.each(data, function (key, val) {
            if (key === 'pump')
                renderValue('pumpState', !!data.state ? data.state : 'waiting for next run', '');
            else
                renderValue(key, val.data[1], val.unit);
        });
        subscribe();
    });

})($);
