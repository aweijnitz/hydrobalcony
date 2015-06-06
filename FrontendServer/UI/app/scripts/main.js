'use strict';

(function UIapp($, io) {
  var log = function (msg) {
    //console.log(msg);
  };

  var renderGraph = function (title, data, target) {
    var d0 = data.map(function (i) {
      var o = i;
      o.timestamp = new Date(i.timestamp);
      return o;
    });
  };

  var renderValue = function (dataName, value, unit) {
    $('#' + dataName).html(value + '&nbsp;' + unit);
  };

  var subscribe = function () {
    // http://hydro.weekendhack.it/dashboard/latest/airTemp
    var host = 'http://hydro.weekendhack.it'; // TODO: Move to conf
    var opts = {path: '/dashboard/socket.io'}; // TODO: Move to conf
    var socket = io.connect(host, opts);
    socket.on('data', function (data) {
      log(data);

//      renderValue(data.data[0], data.data[1], data.unit);
    });
    socket.on('pump', function (data) {
      renderValue('pumpState', data.state, '');
      log(data);
    });
    socket.on('clientConnect', function (data) {
      log(data);
    });

    var url = 'http://andersw.info:7979/sensordata/waterTemp?limit=13000';
    $.getJSON(url, function (data) {
      document.data = data;
      renderGraph('Water Temp', data, document.getElementById('graph'));

    });
  };

  subscribe();

})($, io);
