'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Drink = mongoose.model('Drink'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an drink
 */
exports.create = function (req, res) {
  var drink = new Drink(req.body);

  drink.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drink);
    }
  });
};

/**
 * Show the current drink
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var drink = req.drink ? req.drink.toJSON() : {};

  // Add a custom field to the Drink, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Drink model.
  // drink.isCurrentUserOwner = req.user && drink.user && drink.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(drink);
};

/**
 * Update an drink
 */
exports.update = function (req, res) {
  var drink = req.drink;

  drink.drinkName = req.body.drinkName;
  drink.drinkStyle = req.body.drinkStyle;
  drink.drinkABV = req.body.drinkABV;
  drink.color = req.body.color;
  drink.glass = req.body.glass;
  drink.origin = req.body.origin;
  drink.price12 = req.body.price12;
  drink.price16 = req.body.price16;
  drink.price32 = req.body.price32;
  drink.price64 = req.body.price64;
  drink.onMenu = req.body.onMenu;
  drink.menuNumber = req.body.menuNumber;
  drink.menuIndex = req.body.menuIndex;
  drink.tastingRoomOnly = req.body.tastingRoomOnly;
  drink.drinkImageURL = req.body.drinkImageURL;

  drink.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drink);
    }
  });
};

/**
 * Delete an drink
 */
exports.delete = function (req, res) {
  var drink = req.drink;

  drink.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drink);
    }
  });
};

/**
 * List of Drinks
 */
exports.list = function (req, res) {
  Drink.find().sort('-created').exec(function (err, drinks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(drinks);
    }
  });
};

/**
 * Drink middleware
 */
exports.drinkByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Drink is invalid'
    });
  }

  Drink.findById(id).exec(function (err, drink) {
    if (err) {
      return next(err);
    } else if (!drink) {
      return res.status(404).send({
        message: 'No drink with that identifier has been found'
      });
    }
    req.drink = drink;
    next();
  });

};
