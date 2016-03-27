(function (app) {
  'use strict';

  app.registerModule('drinks');
  app.registerModule('drinks.services');
  app.registerModule('drinks.routes', ['ui.router', 'drinks.services']);
})(ApplicationConfiguration);
