app.controller('SensorGageCtrl', function ($scope, $http, socket) {
  $scope.value = 0;
  $scope.init = function(name) {
    //This function is sort of private constructor for controller
    $scope.title = name;
    $scope.sensorName = name;
    var url = "http://hydro.weekendhack.it/dashboard/latest/"+name;
    $http.get(url).
      success(function (data, status, headers, config) {
        $scope.value = data.value;
        socket.on('data', function (msg) {
          if(name === msg.name) {
            $scope.value = msg.value;
          }
        });

      }).
      error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

  };

});
