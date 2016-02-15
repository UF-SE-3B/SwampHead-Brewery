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
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'drinks', {
      title: 'List Drinks',
      state: 'drinks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'drinks', {
      title: 'Create Article',
      state: 'drinks.create',
      roles: ['user']
    });
  }
})();
