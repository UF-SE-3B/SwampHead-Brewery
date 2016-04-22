'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'toastr', 'ngDragDrop'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('drinks');
  app.registerModule('drinks.services');
  app.registerModule('drinks.routes', ['ui.router', 'drinks.services']);
})(ApplicationConfiguration);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('menu', {
      url: '/menu',
      templateUrl: 'modules/core/client/views/menu.client.view.html',
      controller: 'MenuController',
      controllerAs: 'vm'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$location',
  function ($scope, $state, Authentication, Menus, $location) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

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

    setInterval(updateDrinks, 5000);

    $scope.topbarActive = true;
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['manager', 'bartender', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

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
          roles: ['admin', 'manager', 'bartender'], //all roles can view drink list
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
          roles: ['admin', 'manager'], //only admin and manager can create drinks
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
          roles: ['admin', 'manager'], //only admin and manager can edit drinks
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
          roles: ['admin', 'manager', 'bartender'], //all roles can view drinks
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
    vm.cancel = cancel;
    vm.dropDownChange = dropDownChange;
    var isEdit = vm.drink._id ? true : false; // if we are dealing with a drink already in the database, determine 'isEdit'

    //list of color options
    $scope.colorOptions= [
    { id: 1, colorOption: 'Pale Yellow' },
    { id: 2, colorOption: 'Yellow' },
    { id: 3, colorOption: 'Orange' },
    { id: 4, colorOption: 'Red' },
    { id: 5, colorOption: 'Dark Red' },
    { id: 6, colorOption: 'Brown Black' },
    { id: 7, colorOption: 'Black' } ];

    // list of glass options
    $scope.glassOptions= [
    { id: 1, glassOption: 'Pint' },
    { id: 2, glassOption: 'Snifter' },
    { id: 3, glassOption: 'Wit' },
    { id: 4, glassOption: 'Pilsner' },
    { id: 5, glassOption: 'Hef' }];

    // On edit, have default color loaded
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

    // On edit, have default glass loaded
    $scope.getDefaultGlass=function(){
      if($scope.glassOptions[0].glassOption === vm.drink.glass){
        return ($scope.glassOptions[0]);
      } else if ($scope.glassOptions[1].glassOption === vm.drink.glass) {
        return ($scope.glassOptions[1]);
      } else if ($scope.glassOptions[2].glassOption === vm.drink.glass) {
        return ($scope.glassOptions[2]);
      } else if ($scope.glassOptions[3].glassOption === vm.drink.glass) {
        return ($scope.glassOptions[3]);
      } else if ($scope.glassOptions[4].glassOption === vm.drink.glass) {
        return ($scope.glassOptions[4]);
      } else {
        return;
      }
    };

    //set image when drop downs change
    function dropDownChange(){
      document.getElementById("previewImg").src= selectImage();
    }

    // delete drink from database
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.drink.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('drinks.list', {
          drinkId: res._id
        });
        toastr.success(vm.drink.drinkName + ' was deleted!');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Save Drink
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.drinkForm');
        toastr.error('Drink not updated!');
        return false;
      }

      // set new glass/color/image fields
      vm.drink.drinkImageURL = selectImage();
      vm.drink.color = vm.drink.color.colorOption;
      vm.drink.glass = vm.drink.glass.glassOption;

      // determine whether update or create
      if (vm.drink._id) {
        vm.drink.$update(successCallback, errorCallback);
      } else {
        vm.drink.$save(successCallback, errorCallback);
      }

      //return to listdrink state and respond with approp. toast
      function successCallback(res) {
        $state.go('drinks.list', {
          drinkId: res._id
        });
        if(isEdit){
          toastr.success(vm.drink.drinkName + ' was updated!');
        } else {
          toastr.success(vm.drink.drinkName + ' was created!');
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }

    // cancel button on edit drink
    function cancel() {
      $state.go('drinks.list');
    }

    // pull drink image from Swamphead wp-website
    function selectImage(){

      var url = 'http://swamphead.com/wp-content/uploads/2016/03/';

      //this is an ugly solution but I couldn't think of a better one at the time,
      //since Pint can be Pint or pint same with the colors.
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

(function () {
  'use strict';

  angular
    .module('drinks')
    .controller('DrinksListController', DrinksListController);

  DrinksListController.$inject = ['DrinksService', '$state' , '$scope', 'toastr'];

  function DrinksListController(DrinksService, $state, $scope, toastr) {
    var vm = this;
    vm.AddToMenu = AddToMenu;
    vm.mvOnMenu = mvOnMenu;
    vm.mvOffMenu = mvOffMenu;

    vm.drinks = DrinksService.query();

    // switch to ontap/offtap menu
    function AddToMenu(drink) {
      drink.$update(successCallback, errorCallback);

      function successCallback(res) {
        $state.go('drinks.list', {
          drinkId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //Menu drink toggle notification via toastr
    function mvOnMenu(drink) {
      toastr.success(
        drink.drinkName + ' was added to tap!'
      );
    }
    function mvOffMenu(drink) {
      toastr.success(
        drink.drinkName + ' was removed from tap!'
      );
    }

  }
})();

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

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      //Name of dropdown menu in admin view
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['bartender', 'admin', 'manager'] //correct roles added
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    //list of users on page
    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15; //max 15 users per page
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    // pagination code
    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

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

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a password.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
