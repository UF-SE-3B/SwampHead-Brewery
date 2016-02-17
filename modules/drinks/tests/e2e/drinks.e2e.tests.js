'use strict';

describe('Drinks E2E Tests:', function () {
  describe('Test drinks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/drinks');
      expect(element.all(by.repeater('drink in drinks')).count()).toEqual(0);
    });
  });
});
