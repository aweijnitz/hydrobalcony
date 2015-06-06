app.controller('SensorGageCtrl', function ($scope) {
  $scope.value = 10;
  $scope.init = function(name)
  {
    //This function is sort of private constructor for controller
    $scope.title = name;
    $scope.sensorName = name;

    console.log('sensor: ' + name);
    //Based on passed argument you can make a call to resource
    //and initialize more objects
    //$resource.getMeBond(007)
  };

});
