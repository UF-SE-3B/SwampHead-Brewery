
'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication', 'DrinksService',
  function ($scope, Authentication, DrinksService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var vm = this;
    vm.drinks = DrinksService.query();
    $scope.topbarActive = true;
  }
]);
