(function () {
  'use strict';

  angular
    .module('drinks')
    .controller('DrinksController', DrinksController);

  DrinksController.$inject = ['$scope', '$state', 'drinkResolve', 'Authentication'];

  function DrinksController($scope, $state, drink, Authentication) {
    var vm = this;

    vm.drink = drink;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Drink
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.drink.$remove($state.go('drinks.list'));
      }
    }

    // Save Drink
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.drinkForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.drink._id) {
        vm.drink.$update(successCallback, errorCallback);
      } else {
        vm.drink.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('drinks.view', {
          drinkId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
