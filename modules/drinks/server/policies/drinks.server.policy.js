'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Drinks Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'manager'],
    allows: [{
      resources: '/api/drinks',
      permissions: '*'
    }, {
      resources: '/api/drinks/:drinkId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/drinks',
      permissions: ['get', 'post']
    }, {
      resources: '/api/drinks/:drinkId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/drinks',
      permissions: ['get']
    }, {
      resources: '/api/drinks/:drinkId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Drinks Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an drink is being processed and the current user created it then allow any manipulation
  if (req.drink && req.user && req.drink.user && req.drink.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
