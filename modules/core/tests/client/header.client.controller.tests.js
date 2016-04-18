'use strict';

(function () {
  describe('HeaderController', function () {
    //Initialize global variables
    var scope,
      HeaderController,
      $state,
      Authentication,
      Menus,
      $location;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function ($controller, $rootScope, _$state_, _Authentication_, _Menus_, _$location_) {
      scope = $rootScope.$new();
      $state = _$state_;
      Authentication = _Authentication_;
      Menus = _Menus_;
      $location = _$location_;

//$scope, $state, Authentication, Menus, $location

      HeaderController = $controller('HeaderController', {
        $scope: scope
      });
    }));

    it('should expose the authentication service', function () {
      expect(scope.authentication).toBe(Authentication);
    });

    it('should expose the $state service', function () {
      expect(scope.$state).toBe($state);
    });

    it('should default menu to collapsed', function () {
      expect(scope.isCollapsed).toBeFalsy();
    });

    describe('when toggleCollapsibleMenu', function () {
      var defaultCollapse;
      beforeEach(function () {
        defaultCollapse = scope.isCollapsed;
        scope.toggleCollapsibleMenu();
      });

      it('should toggle isCollapsed to non default value', function () {
        expect(scope.isCollapsed).not.toBe(defaultCollapse);
      });

      it('should then toggle isCollapsed back to default value', function () {
        scope.toggleCollapsibleMenu();
        expect(scope.isCollapsed).toBe(defaultCollapse);
      });
    });

    describe('when view state changes', function () {
      beforeEach(function () {
        scope.isCollapsed = true;
        scope.$broadcast('$stateChangeSuccess');
      });

      it('should set isCollapsed to false', function () {
        expect(scope.isCollapsed).toBeFalsy();
      });
    });
  });
})();
