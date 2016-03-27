'use strict';

/**
 * Module dependencies
 */
var drinksPolicy = require('../policies/drinks.server.policy'),
  drinks = require('../controllers/drinks.server.controller');

module.exports = function (app) {
  // Drinks collection routes
  app.route('/api/drinks').all(drinksPolicy.isAllowed)
    .get(drinks.list)
    .post(drinks.create);

  // Single drink routes
  app.route('/api/drinks/:drinkId').all(drinksPolicy.isAllowed)
    .get(drinks.read)
    .put(drinks.update)
    .delete(drinks.delete);

  // Finish by binding the drink middleware
  app.param('drinkId', drinks.drinkByID);
};
