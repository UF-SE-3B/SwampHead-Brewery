(function () {
  'use strict';

  describe('Drinks Route Tests', function () {
    // Initialize global variables
    var $scope,
      DrinksService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DrinksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DrinksService = _DrinksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('drinks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/drinks');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DrinksController,
          mockDrink;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('drinks.view');
          $templateCache.put('modules/drinks/client/views/view-drink.client.view.html', '');

          // create mock drink
          mockDrink = new DrinksService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Drink about MEAN',
            content: 'MEAN rocks!'
          });

          //Initialize Controller
          DrinksController = $controller('DrinksController as vm', {
            $scope: $scope,
            drinkResolve: mockDrink
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:drinkId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.drinkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            drinkId: 1
          })).toEqual('/drinks/1');
        }));

        it('should attach an drink to the controller scope', function () {
          expect($scope.vm.drink._id).toBe(mockDrink._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/drinks/client/views/view-drink.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DrinksController,
          mockDrink;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('drinks.create');
          $templateCache.put('modules/drinks/client/views/form-drink.client.view.html', '');

          // create mock drink
          mockDrink = new DrinksService();

          //Initialize Controller
          DrinksController = $controller('DrinksController as vm', {
            $scope: $scope,
            drinkResolve: mockDrink
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.drinkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/drinks/create');
        }));

        it('should attach an drink to the controller scope', function () {
          expect($scope.vm.drink._id).toBe(mockDrink._id);
          expect($scope.vm.drink._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/drinks/client/views/form-drink.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DrinksController,
          mockDrink;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('drinks.edit');
          $templateCache.put('modules/drinks/client/views/form-drink.client.view.html', '');

          // create mock drink
          mockDrink = new DrinksService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Drink about MEAN',
            content: 'MEAN rocks!'
          });

          //Initialize Controller
          DrinksController = $controller('DrinksController as vm', {
            $scope: $scope,
            drinkResolve: mockDrink
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:drinkId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.drinkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            drinkId: 1
          })).toEqual('/drinks/1/edit');
        }));

        it('should attach an drink to the controller scope', function () {
          expect($scope.vm.drink._id).toBe(mockDrink._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/drinks/client/views/form-drink.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
