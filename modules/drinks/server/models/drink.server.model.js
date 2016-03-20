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
    type: String,
    trim: true,
    default: ''
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
  origin: {
    type: String,
    trim: true,
    default: 'Swamp Head Brewery'
  },
  price: {
    type: String,
    trim: true,
    default: ''
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
  }
});

mongoose.model('Drink', DrinkSchema);
