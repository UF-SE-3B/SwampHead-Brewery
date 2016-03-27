(function () {
  'use strict';

  angular
    .module('drinks.services')
    .factory('DrinksService', DrinksService);

  DrinksService.$inject = ['$resource'];

  function DrinksService($resource) {
    return $resource('api/drinks/:drinkId', {
      drinkId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
