(function () {
  'use strict';

  angular
    .module('drinks.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('drinks', {
        abstract: true,
        url: '/drinks',
        template: '<ui-view/>'
      })
      .state('drinks.list', {
        url: '',
        templateUrl: 'modules/drinks/client/views/list-drinks.client.view.html',
        controller: 'DrinksListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'manager'],
          pageTitle: 'Drinks List'
        }
      })
      .state('drinks.create', {
        url: '/create',
        templateUrl: 'modules/drinks/client/views/form-drink.client.view.html',
        controller: 'DrinksController',
        controllerAs: 'vm',
        resolve: {
          drinkResolve: newDrink
        },
        data: {
          roles: ['admin', 'manager'],
          pageTitle : 'Drinks Create'
        }
      })
      .state('drinks.edit', {
        url: '/:drinkId/edit',
        templateUrl: 'modules/drinks/client/views/form-drink.client.view.html',
        controller: 'DrinksController',
        controllerAs: 'vm',
        resolve: {
          drinkResolve: getDrink
        },
        data: {
          roles: ['admin', 'manager'],
          pageTitle: 'Edit Drink {{ drink.drinkName }}'
        }
      })
      .state('drinks.view', {
        url: '/:drinkId',
        templateUrl: 'modules/drinks/client/views/view-drink.client.view.html',
        controller: 'DrinksController',
        controllerAs: 'vm',
        resolve: {
          drinkResolve: getDrink
        },
        data:{
          roles: ['admin', 'manager'],
          pageTitle: 'Drink {{ drink.drinkName }}'
        }
      });
  }

  getDrink.$inject = ['$stateParams', 'DrinksService'];

  function getDrink($stateParams, DrinksService) {
    return DrinksService.get({
      drinkId: $stateParams.drinkId
    }).$promise;
  }

  newDrink.$inject = ['DrinksService'];

  function newDrink(DrinksService) {
    return new DrinksService();
  }
})();
