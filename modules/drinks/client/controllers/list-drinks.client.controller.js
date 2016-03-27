(function () {
  'use strict';

  angular
    .module('drinks')
    .controller('DrinksListController', DrinksListController);

  DrinksListController.$inject = ['DrinksService', '$state'];

  function DrinksListController(DrinksService, $state) {
    var vm = this;
    vm.AddToMenu = AddToMenu;

    vm.drinks = DrinksService.query();

    function AddToMenu(drink) {
      drink.$update(successCallback, errorCallback);

      function successCallback(res) {
        $state.go('drinks.list', {
          drinkId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
