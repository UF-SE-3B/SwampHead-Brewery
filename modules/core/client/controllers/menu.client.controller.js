'use strict';

angular.module('core').controller('MenuController', ['$scope', 'Authentication', 'DrinksService',
  function($scope, Authentication, DrinksService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    var vm = this;
    var drinks = DrinksService.query();
    vm.drinks = drinks;

    $scope.reindexDrink = function(drink, index) {
      if(drink.menuIndex !== index) {
        drink.menuIndex = index;
        drink.$update();
      }
    };

    $scope.startDrinkDrag = function(event, ui, title) {
      $scope.draggedIndex = this.$index;
      $scope.draggedDrink = this.drink;
    };

    function updateDrinks() {
      var drinks = DrinksService.query();
      drinks.$promise.then(
        function(result) {
          vm.drinks = result;
        });
    }

    function successCallback(res) {
      updateDrinks();
    }

    function errorCallback(res) {
      console.log("error callback");
    }

    $scope.dropOnDrink = function(event, ui) {
      $scope.draggedDrink.menuIndex = this.$index;
      this.drink.menuIndex = $scope.draggedIndex;
      if($scope.draggedDrink.menuNumber === this.drink.menuNumber){
        $scope.draggedDrink.$update(successCallback, errorCallback);
        this.drink.$update(successCallback, errorCallback);
      }
    };

    $scope.dropOnMenu0 = function(event, ui) {
      if($scope.draggedDrink.menuNumber !== 0) {
        $scope.draggedDrink.menuNumber = 0;

        $scope.draggedDrink.$update(successCallback, errorCallback);
      }
    };

    $scope.dropOnMenu1 = function(event, ui) {
      if($scope.draggedDrink.menuNumber !== 1) {
        $scope.draggedDrink.menuNumber = 1;

        $scope.draggedDrink.$update(successCallback, errorCallback);
      }
    };

    $scope.dropOnMenu2 = function(event, ui) {
      if($scope.draggedDrink.menuNumber !== 2) {
        $scope.draggedDrink.menuNumber = 2;

        $scope.draggedDrink.$update(successCallback, errorCallback);
      }
    };

    setInterval(updateDrinks(), 5000);

    $scope.topbarActive = true;
  }
]);
