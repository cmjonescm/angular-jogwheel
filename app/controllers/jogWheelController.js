//*****************************************************************************
// Copyright © 2012 Waters Corporation. All rights reserved.
//*****************************************************************************


jogWheelController = function($scope, $rootScope, $cacheFactory, $log, propertiesService) {

    $scope.debug = "";

    $scope.debugger = function(message) {
       $scope.debug = message;

       console.log("pps = " + message);
    }


    // public members

    $scope.property = function(propertyName, setting) {
       return propertiesService.property(propertyName, setting);
    }

    $scope.Increment = function(propertyName) {
        propertiesService.Increment(propertyName);
    }

    $scope.Decrement = function(propertyName) {
        propertiesService.Decrement(propertyName);
    }

    $scope.addProperty = function(name, attributes) {
        propertiesService.addProperty(name, attributes);
    }

    $scope.IncrementBy = function(propertyName, setting) {
        propertiesService.IncrementBy(propertyName, setting);
    }  


    // kick it all off
    propertiesService.start();

}


