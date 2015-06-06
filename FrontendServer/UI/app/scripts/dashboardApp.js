var host = 'http://hydro.weekendhack.it'; // TODO: Move to conf
var opts = {path: '/dashboard/socket.io'}; // TODO: Move to conf

var app = angular.module("dashboardApp", ['btford.socket-io', 'ngJustGage', 'ngRoute'])
  .factory('socket', function (socketFactory) {
    return socketFactory({
      ioSocket: io.connect(host, opts)
    });
  })
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html'
      })
      .when('/schedule', {
        templateUrl: 'views/schedule.html',
        controller: 'ScheduleCtrl'
      })
      .when('/webcam', {
        templateUrl: 'views/webcam.html'
      })
      .when('/timelapse', {
        templateUrl: 'views/timelapse.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
