app.controller('SensorGageCtrl', function ($scope, socket) {
  $scope.value = 0;
  $scope.init = function(name) {
    //This function is sort of private constructor for controller
    $scope.title = name;
    $scope.sensorName = name;

  //  console.log('sensor: ' + name);
    socket.on('data', function (msg) {
      if(name === msg.name) {
//        console.log($scope.sensorName + ' - ' + JSON.stringify(msg));
        $scope.value = msg.value;
      }
    });
  };

});
