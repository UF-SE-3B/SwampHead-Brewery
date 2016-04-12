'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', 'toastr' ,
  function ($scope, $state, Authentication, userResolve, toastr) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

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

    // on click of update button
    $scope.update = function (isValid) {
      if (!isValid) { //if drink does not have all fields filled
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        toastr.error('User not updated!');

        return false;
      }

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
