'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Drink = mongoose.model('Drink');

/**
 * Globals
 */
var user, drink, drink_id;

drink = {

  drinkName: 'Drink',
  drinkStyle: 'Pale Ale',
  drinkAbV: 5,
  color: 'yellow',
  glass: 'pint',
  drinkImageURL: 'http://swamphead.com/wp-content/uploads/2016/03/pint_Icon_Yellow.png',
  origin: 'Swamp Head Brewery',
  price12: 6,
  price16: 6,
  price32: 10,
  price64: 14,
  onMenu: false,
  menuNumber: 0,
  menuIndex: 0,
  tastingRoomOnly: false

};



/**
 * Unit tests
 */
describe('Drink Model Unit Tests:', function (done) {

  this.timeout(10000);

  /*beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    }); */

  describe('Saving drinks to the database', function(done){

    this.timeout(10000);

    it('Should save to the database if the drink is provided', function(done){
      new Drink({
        drinkName: drink.drinkName,
        drinkStyle: drink.drinkStyle,
        drinkAbV: drink.drinkABV,
        color: drink.color,
        glass: drink.glass,
        drinkImageURL: drink.drinkImageURL,
        origin: drink.origin,
        price12: drink.price12,
        price16: drink.price16,
        price32: drink.price32,
        price64: drink.price64,
        onMenu: drink.onMenu,
        menuNumber: drink.menuNumber,
        menuIndex: drink.menuIndex,
        tastingRoomOnly: drink.tastingRoomOnly

      }).save(function(err, drink){
        should.not.exist(err);
        drink_id = drink._id;
        done();
      });
    });

    it('Should not save to the db if drinkName is not provided', function(done){
      new Drink({
        drinkStyle: drink.drinkStyle,
        drinkAbV: drink.drinkABV,
        color: drink.color,
        glass: drink.glass,
        drinkImageURL: drink.drinkImageURL,
        onMenu: drink.onMenu,
        menuNumber: drink.menuNumber,
        menuIndex: drink.menuIndex,
        tastingRoomOnly: drink.tastingRoomOnly
      }).save(function(err){
        should.exist(err);
        done();
      });
    });


/*
    user.save(function () {
      drink = new Drink({
        title: 'Drink Title',
        content: 'Drink Content',
        user: user
      });

      drink = new Drink(drink_);

      drink.save(function(err, r){
        should
      })

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return drink.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      drink.title = '';

      return drink.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Drink.remove().exec(function () {
      User.remove().exec(done);
    }); */
    afterEach(function(done){
      if(drink_id) {
        Drink.remove({ _id: drink_id }).exec(function(){
          drink_id = null;
          done();
        });
      } else {
        done();
      }
    });

  });
});
