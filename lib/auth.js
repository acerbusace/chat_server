/* jshint esversion: 6 */

// const dbHandler = require('./lib/mongo.js');

// dbHandler(function(mongo) {

// });

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var redirects = {
  success: '/',
  failure: '/',
};

var auth = function(newRedirects={}) {
  for(var key in newRedirects)
    redirects[key] = newRedirects[key];
};

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('authenticating:');
    console.log('\tuser: ', username);
    console.log('\tpass: ', password);

    if (username !== 'hello') {
      console.error(username, ' not found in database');
      return done(null, false, { message: 'incorrect username or password' });
    }

    if (password !== 'world') {
      console.error(password, ' not matching username found in database');
      return done(null, false, { message: 'incorrect password or password' });
    }

    return done(null, username);
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

auth.prototype.checkAuth = function(req, res, next) {
  console.log('auth user: ', req.user);
  if (!req.user) {
    console.log('user requires authenticated');

    return res.redirect(redirects.failure);
  }

  next();
};

auth.prototype.auth = function(req, res, next) {
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

module.exports = auth;
