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
      roles: ['admin', 'manager', 'bartender'] //all roles can access drinks dropdown
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'drinks', {
      title: 'List Drinks',
      state: 'drinks.list',
      roles: ['admin', 'manager', 'bartender'] //all roles can use drink view
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'drinks', {
      title: 'Create Drink',
      state: 'drinks.create',
      roles: ['admin', 'manager'] //only admin and manager can use create drink
    });
  }
})();
