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

    // switch to ontap/offtap menu
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

    var timer;

    function updateDrinks() {
      var drinks = DrinksService.query();
      drinks.$promise.then(
        function(result) {
          vm.drinks = result;
        });
    }

    function delayTimer() {
      if(timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(updateDrinks, 500);
    }

    function successCallback(res) {
      delayTimer();
    }

    function errorCallback(res) {
      console.log("error callback");
    }

    function doDelayedUpdate(drink) {
      delayTimer();
      setTimeout(function() { doUpdate(drink); }, 100);
    }

    function doUpdate(drink) {
      drink.$update(successCallback, errorCallback);
    }

    $scope.reindexDrink = function(drink, index) {
      if(drink.menuIndex !== index) {
        drink.menuIndex = index;
        doUpdate(drink);
      }
    };

    $scope.startDrinkDrag = function(event, ui, title) {
      $scope.draggedIndex = this.$index;
      $scope.draggedDrink = this.drink;
    };

    $scope.dropOnDrink = function(event, ui) {
      $scope.draggedDrink.menuIndex = this.$index;
      if($scope.draggedDrink.menuNumber === this.drink.menuNumber){
        this.drink.menuIndex = $scope.draggedIndex;
        doUpdate($scope.draggedDrink);
        doUpdate(this.drink);
      }
    };

    $scope.dropOnMenu0 = function(event, ui) {
      if($scope.draggedDrink.menuNumber !== 0) {
        $scope.draggedDrink.menuNumber = 0;
        doDelayedUpdate($scope.draggedDrink);
      }
    };

    $scope.dropOnMenu1 = function(event, ui) {
      if($scope.draggedDrink.menuNumber !== 1) {
        $scope.draggedDrink.menuNumber = 1;
        doDelayedUpdate($scope.draggedDrink);
      }
    };

    $scope.dropOnMenu2 = function(event, ui) {
      if($scope.draggedDrink.menuNumber !== 2) {
        $scope.draggedDrink.menuNumber = 2;
        doDelayedUpdate($scope.draggedDrink);
      }
    };


  }
})();
