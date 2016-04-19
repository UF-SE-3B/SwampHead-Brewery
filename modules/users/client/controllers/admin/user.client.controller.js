'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', 'toastr' ,
  function ($scope, $state, Authentication, userResolve, toastr) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    var vm = this;
    vm.person = userResolve;

    //drop down options for roles
    $scope.roleOptions= [
    { id: 1, roleOption: 'bartender' },
    { id: 2, roleOption: 'manager' },
    { id: 3, roleOption: 'admin' },
    { id: 4, roleOption: 'user' }];

    //set drop down once we have the roles info
    vm.person.$promise.then(function(result) {
      if($scope.roleOptions[0].roleOption === $scope.user.roles[0]){
        $scope.user.roles = $scope.roleOptions[0];
      } else if ($scope.roleOptions[1].roleOption === $scope.user.roles[0]) {
        $scope.user.roles = $scope.roleOptions[1];
      } else if ($scope.roleOptions[2].roleOption === $scope.user.roles[0]) {
        $scope.user.roles = $scope.roleOptions[2];
      } else if ($scope.roleOptions[3].roleOption === $scope.user.roles[0]) {
        $scope.user.roles = $scope.roleOptions[3];
      } else {
        return;
      }
    }, function(err) {
      console.log(err); // Error: "It broke"
    });

    // delete user from database
    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
            toastr.success($scope.user.username + ' was deleted!');
          });
        }
      }
    };

    $scope.cancel = function () {
      $state.go('admin.users');
    };

    // on click of update button
    $scope.update = function (isValid) {
      if (!isValid) { //if drink does not have all fields filled
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        toastr.error('User not updated!');

        return false;
      }
      $scope.user.roles = $scope.user.roles.roleOption;
      var user = $scope.user;

      //pass 'isValid', go back user list on success
      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        toastr.success(user.username + ' was updated!');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        toastr.warning($scope.error);
      });
    };
  }
]);
