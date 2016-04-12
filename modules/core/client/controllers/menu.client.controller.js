'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication', 'DrinksService',
  function($scope, Authentication, DrinksService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    var vm = this;
    var drinks = DrinksService.query();
    vm.drinks = drinks;

    setInterval(function() {
      var drinks = DrinksService.query();
      drinks.$promise.then(
        function(result) {
          vm.drinks = result;
        });
    }, 5000);

    $scope.topbarActive = true;
  }
]);
