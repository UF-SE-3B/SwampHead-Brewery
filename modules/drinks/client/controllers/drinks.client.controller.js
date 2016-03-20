(function () {
  'use strict';

  angular
    .module('drinks')
    .controller('DrinksController', DrinksController);

  DrinksController.$inject = ['$scope', '$state', 'drinkResolve', 'Authentication'];

  function DrinksController($scope, $state, drink, Authentication) {
    var vm = this;

    $scope.authentication = Authentication;

    vm.drink = drink;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // drinkColor.color = vm.drink.color;
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
      var colorSelecter = document.getElementById('colorSelecter');
      var colorSelecterText = colorSelecter.options[colorSelecter.selectedIndex].innerHTML;
      var glassSelecter = document.getElementById('glassSelecter');
      var glassSelecterText = glassSelecter.options[glassSelecter.selectedIndex].innerHTML;
      vm.drink.color = colorSelecterText;
      vm.drink.glass = glassSelecterText;
      vm.drink.drinkImageURL = selectImage();
      if (vm.drink._id) {
        vm.drink.$update(successCallback, errorCallback);
      } else {
        vm.drink.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('drinks.list', {
          drinkId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.colorOptions= [
    { id: 1, colorOption: 'Gold' },
    { id: 2, colorOption: 'Light Brown' },
    { id: 3, colorOption: 'Brown' },
    { id: 4, colorOption: 'Red' },
    { id: 5, colorOption: 'Dark Brown' }];

    $scope.glassOptions= [
    { id: 1, glassOption: 'Pint' },
    { id: 2, glassOption: 'Snifter' }];

    function selectImage(){
      if(document.getElementById('glassSelecter').selectedIndex === 0){
        if(document.getElementById('colorSelecter').selectedIndex === 0){
          return "http://swamphead.com/wp-content/uploads/2013/11/light_pint1.png";
        } else if (document.getElementById('colorSelecter').selectedIndex === 1){
          return "http://swamphead.com/wp-content/uploads/2013/11/pale_ale_pint_2.png";
        } else if (document.getElementById('colorSelecter').selectedIndex === 2){
          return "http://swamphead.com/wp-content/uploads/2013/11/oktoberfest_pint.png";
        } else if (document.getElementById('colorSelecter').selectedIndex === 3){
          return "http://swamphead.com/wp-content/uploads/2013/11/red_pint.png";
        } else if (document.getElementById('colorSelecter').selectedIndex === 4){
          return "http://swamphead.com/wp-content/uploads/2013/11/stout_pint1.png";
        }
      } else if (document.getElementById('glassSelecter').selectedIndex === 1){
        if(document.getElementById('colorSelecter').selectedIndex === 0){
          return "http://swamphead.com/wp-content/uploads/2013/11/saison_snifter2.png";
        } else if (document.getElementById('colorSelecter').selectedIndex === 1){
          return "http://swamphead.com/wp-content/uploads/2013/11/pale_ale_snifter.png";
        } else if (document.getElementById('colorSelecter').selectedIndex === 2){
          return "http://swamphead.com/wp-content/uploads/2013/11/amber_snifter.png";
        } else if (document.getElementById('colorSelecter').selectedIndex === 3){
          return "http://swamphead.com/wp-content/uploads/2013/11/red_snifter.png";
        } else if (document.getElementById('colorSelecter').selectedIndex === 4){
          return "http://swamphead.com/wp-content/uploads/2013/11/stout_snifter.png";
        }
      } else {
        return "";
      }

    }
  }
})();
