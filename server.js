/* jshint esversion: 6 */

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const index = require('./routes/index');
const login = require('./routes/login');
const path = require('path');

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', login);
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret:'this is a legit app', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.post('/login', auth);
app.use(checkAuth);
app.use('/', index);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('strategy part');
    console.log('user: ' + username);
    console.log('pass: ' + password);
    if (username !== 'hello') {
      console.log('incorrect username');
      return done(null, false, { message: 'incorrect username' });
    }

    if (password !== 'world') {
      console.log('incorrect password');
      return done(null, false, { message: 'incorrect password' });
    }

    return done(null, username);
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializeUser: ' + user);
  done(null, user);
});

function checkAuth(req, res, next) {
  console.log('auth user: ' + req.user);
  if (!req.user) {
    console.log('user requires authenticated');

    return res.redirect('/login');
  }

  next();
}

function auth(req, res, next) {
  console.log('auth page part');
  passport.authenticate('local', function(err, user, info) {
    console.log('user: ' + user);
    console.log('info: ' + JSON.stringify(info));
    if (err) {
      console.log('auth err: ' + err);
      return res.end('auth err: ' + JSON.stringify(err));
    }

    if (!user) {
      return res.redirect('/login');
      // res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      // return res.send(401);
    }

    req.logIn(user, function(err) {
      if (err) {
        console.log('auth err: ' + err);
        return res.end('logIn err: ' + JSON.stringify(err));
      }
      return res.redirect('/');
    });
  })(req, res, next);
}

/* ----------------------------------------------------------------------------- */

io.on('connection', function(socket) {
    console.log('user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg) {
        console.log('chat message: ', msg);
        io.emit('chat message', msg);
    });
});

var port = 8000;
http.listen(port, function() {
    console.log('listening on port ' + port);
});

module.exports = app;
