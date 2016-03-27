'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Drink = mongoose.model('Drink'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, drink;

/**
 * Drink routes tests
 */
describe('Drink CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new drink
    user.save(function () {
      drink = {
        title: 'Drink Title',
        content: 'Drink Content'
      };

      done();
    });
  });

  it('should be able to save an drink if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new drink
        agent.post('/api/drinks')
          .send(drink)
          .expect(200)
          .end(function (drinkSaveErr, drinkSaveRes) {
            // Handle drink save error
            if (drinkSaveErr) {
              return done(drinkSaveErr);
            }

            // Get a list of drinks
            agent.get('/api/drinks')
              .end(function (drinksGetErr, drinksGetRes) {
                // Handle drink save error
                if (drinksGetErr) {
                  return done(drinksGetErr);
                }

                // Get drinks list
                var drinks = drinksGetRes.body;

                // Set assertions
                (drinks[0].user._id).should.equal(userId);
                (drinks[0].title).should.match('Drink Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an drink if not logged in', function (done) {
    agent.post('/api/drinks')
      .send(drink)
      .expect(403)
      .end(function (drinkSaveErr, drinkSaveRes) {
        // Call the assertion callback
        done(drinkSaveErr);
      });
  });

  it('should not be able to save an drink if no title is provided', function (done) {
    // Invalidate title field
    drink.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new drink
        agent.post('/api/drinks')
          .send(drink)
          .expect(400)
          .end(function (drinkSaveErr, drinkSaveRes) {
            // Set message assertion
            (drinkSaveRes.body.message).should.match('Title cannot be blank');

            // Handle drink save error
            done(drinkSaveErr);
          });
      });
  });

  it('should be able to update an drink if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new drink
        agent.post('/api/drinks')
          .send(drink)
          .expect(200)
          .end(function (drinkSaveErr, drinkSaveRes) {
            // Handle drink save error
            if (drinkSaveErr) {
              return done(drinkSaveErr);
            }

            // Update drink title
            drink.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing drink
            agent.put('/api/drinks/' + drinkSaveRes.body._id)
              .send(drink)
              .expect(200)
              .end(function (drinkUpdateErr, drinkUpdateRes) {
                // Handle drink update error
                if (drinkUpdateErr) {
                  return done(drinkUpdateErr);
                }

                // Set assertions
                (drinkUpdateRes.body._id).should.equal(drinkSaveRes.body._id);
                (drinkUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of drinks if not signed in', function (done) {
    // Create new drink model instance
    var drinkObj = new Drink(drink);

    // Save the drink
    drinkObj.save(function () {
      // Request drinks
      request(app).get('/api/drinks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single drink if not signed in', function (done) {
    // Create new drink model instance
    var drinkObj = new Drink(drink);

    // Save the drink
    drinkObj.save(function () {
      request(app).get('/api/drinks/' + drinkObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', drink.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single drink with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/drinks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Drink is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single drink which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent drink
    request(app).get('/api/drinks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No drink with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an drink if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new drink
        agent.post('/api/drinks')
          .send(drink)
          .expect(200)
          .end(function (drinkSaveErr, drinkSaveRes) {
            // Handle drink save error
            if (drinkSaveErr) {
              return done(drinkSaveErr);
            }

            // Delete an existing drink
            agent.delete('/api/drinks/' + drinkSaveRes.body._id)
              .send(drink)
              .expect(200)
              .end(function (drinkDeleteErr, drinkDeleteRes) {
                // Handle drink error error
                if (drinkDeleteErr) {
                  return done(drinkDeleteErr);
                }

                // Set assertions
                (drinkDeleteRes.body._id).should.equal(drinkSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an drink if not signed in', function (done) {
    // Set drink user
    drink.user = user;

    // Create new drink model instance
    var drinkObj = new Drink(drink);

    // Save the drink
    drinkObj.save(function () {
      // Try deleting drink
      request(app).delete('/api/drinks/' + drinkObj._id)
        .expect(403)
        .end(function (drinkDeleteErr, drinkDeleteRes) {
          // Set message assertion
          (drinkDeleteRes.body.message).should.match('User is not authorized');

          // Handle drink error error
          done(drinkDeleteErr);
        });

    });
  });

  it('should be able to get a single drink that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new drink
          agent.post('/api/drinks')
            .send(drink)
            .expect(200)
            .end(function (drinkSaveErr, drinkSaveRes) {
              // Handle drink save error
              if (drinkSaveErr) {
                return done(drinkSaveErr);
              }

              // Set assertions on new drink
              (drinkSaveRes.body.title).should.equal(drink.title);
              should.exist(drinkSaveRes.body.user);
              should.equal(drinkSaveRes.body.user._id, orphanId);

              // force the drink to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the drink
                    agent.get('/api/drinks/' + drinkSaveRes.body._id)
                      .expect(200)
                      .end(function (drinkInfoErr, drinkInfoRes) {
                        // Handle drink error
                        if (drinkInfoErr) {
                          return done(drinkInfoErr);
                        }

                        // Set assertions
                        (drinkInfoRes.body._id).should.equal(drinkSaveRes.body._id);
                        (drinkInfoRes.body.title).should.equal(drink.title);
                        should.equal(drinkInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single drink if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new drink model instance
    drink.user = user;
    var drinkObj = new Drink(drink);

    // Save the drink
    drinkObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new drink
          agent.post('/api/drinks')
            .send(drink)
            .expect(200)
            .end(function (drinkSaveErr, drinkSaveRes) {
              // Handle drink save error
              if (drinkSaveErr) {
                return done(drinkSaveErr);
              }

              // Get the drink
              agent.get('/api/drinks/' + drinkSaveRes.body._id)
                .expect(200)
                .end(function (drinkInfoErr, drinkInfoRes) {
                  // Handle drink error
                  if (drinkInfoErr) {
                    return done(drinkInfoErr);
                  }

                  // Set assertions
                  (drinkInfoRes.body._id).should.equal(drinkSaveRes.body._id);
                  (drinkInfoRes.body.title).should.equal(drink.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (drinkInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single drink if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new drink model instance
    var drinkObj = new Drink(drink);

    // Save the drink
    drinkObj.save(function () {
      request(app).get('/api/drinks/' + drinkObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', drink.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single drink, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Drink
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new drink
          agent.post('/api/drinks')
            .send(drink)
            .expect(200)
            .end(function (drinkSaveErr, drinkSaveRes) {
              // Handle drink save error
              if (drinkSaveErr) {
                return done(drinkSaveErr);
              }

              // Set assertions on new drink
              (drinkSaveRes.body.title).should.equal(drink.title);
              should.exist(drinkSaveRes.body.user);
              should.equal(drinkSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the drink
                  agent.get('/api/drinks/' + drinkSaveRes.body._id)
                    .expect(200)
                    .end(function (drinkInfoErr, drinkInfoRes) {
                      // Handle drink error
                      if (drinkInfoErr) {
                        return done(drinkInfoErr);
                      }

                      // Set assertions
                      (drinkInfoRes.body._id).should.equal(drinkSaveRes.body._id);
                      (drinkInfoRes.body.title).should.equal(drink.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (drinkInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Drink.remove().exec(done);
    });
  });
});
