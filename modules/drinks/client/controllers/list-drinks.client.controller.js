(function () {
  'use strict';

  angular
    .module('drinks')
    .controller('DrinksListController', DrinksListController);

  DrinksListController.$inject = ['DrinksService'];

  function DrinksListController(DrinksService) {
    var vm = this;

    vm.drinks = DrinksService.query();
  }
})();
