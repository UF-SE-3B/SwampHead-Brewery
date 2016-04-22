'use strict';

describe('Drinks E2E Tests:', function () {
  var user3 = {
    firstName: 'test',
    lastName: 'user3',
    email: 'test.user3@meanjs.com',
    username: 'testUser3',
    password: 'P@$$w0rd!!',
    roles: 'admin'
  };

  var drink = {

    drinkName: 'Drink',
    drinkStyle: 'Pale Ale',
    drinkAbV: 5,
    color: 'yellow',
    glass: 'pint',
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

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:3001/authentication/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };
//goes to the website and can click top open menu
/*
  it('Should go to the Menu', function(){
    browser.get('http://localhost:3001');
    //click 'Register'
    element(by.css('#menubutton')).click();
    browser.sleep(500);
    //go to register page
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
  });
  */


//create user, log in

  it('Should Successfully register new user', function () {
    browser.get('http://localhost:3001/authentication/signup');
    // Enter FirstName
    element(by.model('credentials.firstName')).sendKeys(user3.firstName);
    // Enter LastName
    element(by.model('credentials.lastName')).sendKeys(user3.lastName);
    // Enter Email
    element(by.model('credentials.email')).sendKeys(user3.email);
    // Enter UserName
    element(by.model('credentials.username')).sendKeys(user3.username);
    // Enter Password
    element(by.model('credentials.password')).sendKeys(user3.password);
    // Click Submit button
    element(by.css('button[type="submit"]')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
  });

  it('Test Drink Creation and Menu Display', function() {
    //Make sure user is signed out first
    //signout();
    //Sign in
    /*
    browser.get('http://localhost:3001/authentication/signin');
    // Enter UserName
    element(by.model('credentials.username')).sendKeys(user1.username);
    // Enter Password
    element(by.model('credentials.password')).sendKeys(user1.password);
    // Click Submit button
    element(by.css('button[type="submit"]')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/'); */

    browser.get('http://localhost:3001/drinks/create'); //creating a drink as an admin
    browser.sleep(1000);
    element(by.css('#drinkName')).sendKeys(drink.drinkName);
    element(by.css('#drinkStyle')).sendKeys(drink.drinkStyle);
    element(by.css('#drinkABV')).sendKeys(drink.drinkAbV);
    element(by.model('vm.drink.color'))
      .all(by.tagName('option'))
      .get(1)
      .click().then();

    element(by.model('vm.drink.glass'))
      .all(by.tagName('option'))
      .get(1)
      .click().then();

    element(by.css('#origin')).sendKeys(drink.origin);
    element(by.css('#drinkABV')).sendKeys(drink.drinkAbV);
    element(by.css('#price12')).sendKeys(drink.price12);
    //browser.sleep(1000);
    element(by.css('#createbutton')).click(); //hit create button



    browser.sleep(8000);


    element(by.css('#checkBox')).click(); //checkbox is selected to display drink on to menu
    browser.sleep(4000);
    //browser.sleep(10000);


    browser.get('http://localhost:3001/menu'); //congrats drink is now on menu
    browser.sleep(3000);

    signout();

  });


});
