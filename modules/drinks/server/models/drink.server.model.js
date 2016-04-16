'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Drink Schema
 */
var DrinkSchema = new Schema({
  drinkName: {
    type: String,
    unique: true,
    required: 'Please fill in a drink name',
    trim: true,
    default: ''
  },
  drinkStyle: {
    type: String,
    trim: true,
    default: ''
  },
  drinkABV: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    trim: true,
    default: ''
  },
  glass: {
    type: String,
    trim: true,
    default: ''
  },
  drinkImageURL: {
    type: String
  },
  origin: {
    type: String,
    trim: true,
    default: 'Swamp Head Brewery'
  },
  price12: {
    type: Number,
  },
  price16: {
    type: Number,
  },
  price32: {
    type: Number,
  },
  price64: {
    type: Number,
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  onMenu: {
    type: Boolean,
    default: false
  },
  menuNumber: {
    type: Number,
    default: 0
  },
  menuIndex: {
    type: Number,
    default: 0
  },
  tastingRoomOnly: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Drink', DrinkSchema);
