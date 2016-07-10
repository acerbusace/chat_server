/* jshint esversion: 6 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbHandler = require('./mongo.js');

var redirects = {
  success: '/',
  failure: '/',
};

module.exports = function(mongo, newRedirects={}) {
  for(var key in newRedirects)
    redirects[key] = newRedirects[key];

  // mongo.createUser({ 
  //   username: 'hello', 
  //   password: 'world',
  // });

  var auth = {};

  var validate = function(username, password, done) {
    mongo.findUser({
      'username': username
    }, function(user) {
      if (user) {
        if (user.validPassword(password))
          return done(user.getId());
        }
        return done();
      });
   };

   auth.getUsername = function(id, done) {
     mongo.findUser({
       _id: id,
     }, function(user) {
       if (user) return done(user.username);
     });
   };

  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('authenticating: ', username, ', ', password);

      validate(username, password, function(user) {
        if (!user)
          return done(null, false, { message: 'incorrect username or password' });
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    console.log('serializeUser: ', user);
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log('deserializeUser: ', user);
    done(null, user);
  });

  auth.checkAuth = function(req, res, next) {
    console.log('auth user: ', req.user);
    if (!req.user) {
      console.log('user requires authenticated');

      return res.redirect(redirects.failure);
    }

    next();
  };

  auth.auth = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      console.log('user: ', user);
      console.error('info: ', JSON.stringify(info));

      if (err) {
        console.error('auth err: ', err);
        return res.end('auth err: ', JSON.stringify(err));
      }

      if (!user)
        return res.redirect(redirects.failure);

      req.logIn(user, function(err) {
        if (err) {
          console.error('auth err: ', err);
          return res.end('logIn err: ', JSON.stringify(err));
        }

        return res.redirect(redirects.success);
      });
    })(req, res, next);
  };

  return auth;
};
