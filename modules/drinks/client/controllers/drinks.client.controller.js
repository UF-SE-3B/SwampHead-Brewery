(function () {
  'use strict';

  angular
    .module('drinks')
    .controller('DrinksController', DrinksController);

  DrinksController.$inject = ['$scope', '$state', 'drinkResolve', 'Authentication', 'toastr'];

  function DrinksController($scope, $state, drink, Authentication, toastr) {
    var vm = this;

    $scope.authentication = Authentication;

    vm.drink = drink;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.dropDownChange = dropDownChange;

    $scope.colorOptions= [
    { id: 1, colorOption: 'Pale Yellow' },
    { id: 2, colorOption: 'Yellow' },
    { id: 3, colorOption: 'Orange' },
    { id: 4, colorOption: 'Red' },
    { id: 5, colorOption: 'Dark Red' },
    { id: 6, colorOption: 'Brown Black' },
    { id: 7, colorOption: 'Black' } ];

    $scope.glassOptions= [
    { id: 1, glassOption: 'Pint' },
    { id: 2, glassOption: 'Snifter' },
    { id: 3, glassOption: 'Wit' },
    { id: 4, glassOption: 'Pilsner' },
    { id: 5, glassOption: 'Hef' }];

    $scope.getDefaultColor=function(){
      if($scope.colorOptions[0].colorOption === vm.drink.color){
        return ($scope.colorOptions[0]);
      } else if ($scope.colorOptions[1].colorOption === vm.drink.color) {
        return ($scope.colorOptions[1]);
      } else if ($scope.colorOptions[2].colorOption === vm.drink.color) {
        return ($scope.colorOptions[2]);
      } else if ($scope.colorOptions[3].colorOption === vm.drink.color) {
        return ($scope.colorOptions[3]);
      } else if ($scope.colorOptions[4].colorOption === vm.drink.color) {
        return ($scope.colorOptions[4]);
      } else if ($scope.colorOptions[5].colorOption === vm.drink.color) {
        return ($scope.colorOptions[5]);
      } else if ($scope.colorOptions[6].colorOption === vm.drink.color) {
        return ($scope.colorOptions[6]);
      } else {
        return;
      }
    };

    $scope.getDefaultGlass=function(){
      if($scope.glassOptions[0].glassOption === vm.drink.glass){
        return ($scope.glassOptions[0]);
      } else if ($scope.glassOptions[1].glassOption === vm.drink.glass) {
        return ($scope.glassOptions[1]);
      } else if ($scope.glassOptions[2].glassOption === vm.drink.glass) {
        return ($scope.glassOptions[2]);
      } else if ($scope.glassOptions[3].glassOption === vm.drink.glass) {
        return ($scope.glassOptions[3]);
      } else {
        return;
      }
    };

    function dropDownChange(){
      document.getElementById("previewImg").src= selectImage();
    }

    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.drink.$remove(successCallback, errorCallback);
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

    // Save Drink
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.drinkForm');
        toastr.error( 'Drink not updated');
        return false;
      }

      // TODO: move create/update logic to service
      vm.drink.drinkImageURL = selectImage();
      vm.drink.color = vm.drink.color.colorOption;
      vm.drink.glass = vm.drink.glass.glassOption;
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

    function selectImage(){

      var url = 'http://swamphead.com/wp-content/uploads/2016/03/';

      if(vm.drink.glass.glassOption === 'Pint'){
        if(vm.drink.color.colorOption === 'Pale Yellow'){
          return url + 'Pint_Icon_PaleYellow.png';
        } else if (vm.drink.color.colorOption === 'Yellow'){
          return url + 'pint_Icon_Yellow.png';
        } else if (vm.drink.color.colorOption === 'Orange'){
          return url + 'pint_Icon_Orange.png';
        } else if (vm.drink.color.colorOption === 'Red'){
          return url + 'pint_Icon_Red.png';
        } else if (vm.drink.color.colorOption === 'Dark Red'){
          return url + 'pint_Icon_darkRed.png';
        } else if (vm.drink.color.colorOption === 'Brown Black'){
          return url + 'pint_Icon_brownBlack.png';
        } else if (vm.drink.color.colorOption === 'Black'){
          return url + 'pint_Icon_Black.png';
        }
      } else if (vm.drink.glass.glassOption === 'Snifter'){
        if(vm.drink.color.colorOption === 'Pale Yellow'){
          return url + 'sniffer_Icon_paleYellow.png';
        } else if (vm.drink.color.colorOption === 'Yellow'){
          return url + 'sniffer_Icon_Yellow.png';
        } else if (vm.drink.color.colorOption === 'Orange'){
          return url + 'sniffer_Icon_Orange.png';
        } else if (vm.drink.color.colorOption === 'Red'){
          return url + 'sniffer_Icon_Red.png';
        } else if (vm.drink.color.colorOption === 'Dark Red'){
          return url + 'sniffer_Icon_DarkRed.png';
        } else if (vm.drink.color.colorOption === 'Brown Black'){
          return url + 'sniffer_Icon_BrownBlack.png';
        } else if (vm.drink.color.colorOption === 'Black'){
          return url + 'sniffer_Icon_Black.png';
        }
      } else if (vm.drink.glass.glassOption === 'Wit'){
        if(vm.drink.color.colorOption === 'Pale Yellow'){
          return url + 'wit_Icon_paleYellow.png';
        } else if (vm.drink.color.colorOption === 'Yellow'){
          return url + 'wit_Icon_Yellow.png';
        } else if (vm.drink.color.colorOption === 'Orange'){
          return url + 'wit_Icon_orange.png';
        } else if (vm.drink.color.colorOption === 'Red'){
          return url + 'wit_Icon_red.png';
        } else if (vm.drink.color.colorOption === 'Dark Red'){
          return url + 'wit_Icon_darkRed.png';
        } else if (vm.drink.color.colorOption === 'Brown Black'){
          return url + 'wit_Icon_brownBlack.png';
        } else if (vm.drink.color.colorOption === 'Black'){
          return url + 'wit_Icon_Black.png';
        }
      } else if (vm.drink.glass.glassOption === 'Pilsner'){
        if(vm.drink.color.colorOption === 'Pale Yellow'){
          return url + 'pilsner_icon_paleYellow.png';
        } else if (vm.drink.color.colorOption === 'Yellow'){
          return url + 'pilsner_icon_Yellow.png';
        } else if (vm.drink.color.colorOption === 'Orange'){
          return url + 'pilsner_icon_orange.png';
        } else if (vm.drink.color.colorOption === 'Red'){
          return url + 'pilsner_icon_red.png';
        } else if (vm.drink.color.colorOption === 'Dark Red'){
          return url + 'pilsner_icon_darkRed.png';
        } else if (vm.drink.color.colorOption === 'Brown Black'){
          return url + 'pilsner_icon_brownBlack.png';
        } else if (vm.drink.color.colorOption === 'Black'){
          return url + 'pilsner_icon_Black.png';
        }
      } else if (vm.drink.glass.glassOption === 'Hef'){
        if(vm.drink.color.colorOption === 'Pale Yellow'){
          return url + 'hef_Icon_paleYellow.png';
        } else if (vm.drink.color.colorOption === 'Yellow'){
          return url + 'hef_Icon_yellow.png';
        } else if (vm.drink.color.colorOption === 'Orange'){
          return url + 'hef_Icon_orange.png';
        } else if (vm.drink.color.colorOption === 'Red'){
          return url + 'hef_Icon_red.png';
        } else if (vm.drink.color.colorOption === 'Dark Red'){
          return url + 'hef_Icon_darkRed.png';
        } else if (vm.drink.color.colorOption === 'Brown Black'){
          return url + 'hef_icon_brownBlack.png';
        } else if (vm.drink.color.colorOption === 'Black'){
          return url + 'hef_Icon_Black.png';
        }
      } else {
        return 'http://swamphead.com/wp-content/uploads/2016/03/circleLogo_White-01.png';
      }
    }

  }
})();
