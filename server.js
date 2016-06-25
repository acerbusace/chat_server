/* jshint esversion: 6 */

const express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const index = require('./routes/index');
const login = require('./routes/login');
const path = require('path');

app.use('/', login);
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.post('/login', auth);
app.use(checkAuth);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('at strategy part');
    console.log('user: ' + username);
    console.log('pass: ' + password);
    if (username !== 'hello')
      return done(null, false, { message: 'incorrect username' });

    if (password !== 'world')
      return done(null, false, { message: 'incorrect password' });

    return done(null, username);
  }
));
    

function checkAuth(req, res, next) {
  if (!req.user) {
    console.log('user requires authenticated');

    return res.redirect('/login');
  }
}

function auth(req, res, next) {
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

    return res.redirect('/');
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
