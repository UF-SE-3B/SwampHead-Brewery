(function () {
  'use strict';

  angular
    .module('drinks')
    .controller('DrinksListController', DrinksListController);

  DrinksListController.$inject = ['DrinksService', '$state' , '$scope', 'toastr'];

  function DrinksListController(DrinksService, $state, $scope, toastr) {
    var vm = this;
    vm.AddToMenu = AddToMenu;
    vm.mvOnMenu = mvOnMenu;
    vm.mvOffMenu = mvOffMenu;

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

    //Menu drink toggle notification via toastr
    function mvOnMenu(drink) {
      toastr.success(
        drink.drinkName + ' was added to tap!'
      );
    }
    function mvOffMenu(drink) {
      toastr.success(
        drink.drinkName + ' was removed from tap!'
      );
    }

  }
})();
