'use strict';

(function UIapp($, io, MG) {
  var log = function (msg) {
    console.log(msg);
  };

  var renderGraph = function(title, data, target) {
    var d0 = data.map(function(i) { var o = i; o.timestamp = new Date(i.timestamp); return o; });
    MG.data_graphic({
      title: title || '',
      description: '',
      data: [d0],
      width: 400,
      height: 250,
      target: target,
      x_accessor: "timestamp",
      y_accessor: "value",
      interpolate: "monotone"
    });
  };

  var renderValue = function (dataName, value, unit) {
    $('#' + dataName).html(value + '&nbsp;' + unit);
  };

  var subscribe = function () {
    var host = 'http://andersw.info:7979/';
    var socket = io.connect(host);
    socket.on('data', function (data) {
      log(data);

//      renderValue(data.data[0], data.data[1], data.unit);
    });
    socket.on('pump', function (data) {
      renderValue('pumpState', data.state, '');
    });
    socket.on('clientConnect', function(data) {
      log(data);
    });

    var url = 'http://andersw.info:7979/sensordata/waterTemp?limit=13000';
    $.getJSON(url, function(data) {
      document.data = data;
      renderGraph('Water Temp', data, document.getElementById('graph'));

    });
  };

  subscribe();

})($, io, MG);
