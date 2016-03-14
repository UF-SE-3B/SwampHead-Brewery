(function () {
  'use strict';

  angular
    .module('drinks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Drinks',
      state: 'drinks',
      type: 'dropdown',
      roles: ['admin', 'manager']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'drinks', {
      title: 'List Drinks',
      state: 'drinks.list',
      roles: ['admin', 'manager']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'drinks', {
      title: 'Create Drink',
      state: 'drinks.create',
      roles: ['admin', 'manager']
    });
  }
})();
