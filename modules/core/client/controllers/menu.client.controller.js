'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication', 'DrinksService',
  function($scope, Authentication, DrinksService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    var vm = this;
    var drinks = DrinksService.query();
    vm.drinks = drinks;
    var timer;

    var interval = setInterval(updateDrinks, 5000);

    function updateDrinks() {
      var drinks = DrinksService.query();
      drinks.$promise.then(
        function(result) {
          vm.drinks = result;
        });
    }

    $scope.topbarActive = true;
  }
]);
