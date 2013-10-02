'use strict';


describe('jogWheelCongtroller tests', function(){
    var MODULE_NAME = 'jogWheelModule.controller';

    var el;
    var mockPropertiesService;

    // Get hold of the app/module
    beforeEach(module(MODULE_NAME));

    it('should have controller scope with a setting which has an initial value.', inject(function($rootScope, $controller) {
        // Arrange
        var scope = $rootScope.$new();
        $controller("jogWheelController", { $scope: scope });

        // Action

        // Assert
        expect(scope.setting).toEqual(0.0);
    }));




});

