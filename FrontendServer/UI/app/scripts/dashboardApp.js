var host = 'http://hydro.weekendhack.it'; // TODO: Move to conf
var opts = {path: '/dashboard/socket.io'}; // TODO: Move to conf

var app = angular.module("dashboardApp", ['btford.socket-io', 'ngJustGage'])
  .factory('socket', function (socketFactory) {
    return socketFactory({
      ioSocket: io.connect(host, opts)
    });
  });
