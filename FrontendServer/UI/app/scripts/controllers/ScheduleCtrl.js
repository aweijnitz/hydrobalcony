app.controller('ScheduleCtrl', function ($scope, $http) {
  $http.get('http://hydro.homelinux.net/pumpschedule?count=24&format=json').
    success(function (data, status, headers, config) {
      var dates = data.map(function (d) {
        var tmp = d.split(',').slice(1).join().trim(); // "June 7th 2015, 08:47:00 +02:00"
        var str = moment(tmp, "MMMM Do YYYY, HH:mm:ss ZZ").format("dddd, MMM Do, HH:mm:ss");
        return str;
      });
      console.log(dates);
      $scope.schedule = dates;
    }).
    error(function (data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

});
