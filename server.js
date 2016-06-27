/* jshint esversion: 6 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const index = require('./routes/index');
const login = require('./routes/login');
const authHandler = require('./lib/auth.js');

authHandler(function(err, auth) {
  if (err) throw err;

  app.use(morgan('tiny'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', login);

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(session({
    secret: 'this is a legit app',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.post('/login', auth.auth);
  app.use(auth.checkAuth);
  app.use('/', index);
}, {success:'/', failure:'/login'});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

/* ----------------------------------------------------------------------------- */

var port = 8000;
http.listen(port, function() {
  console.log('listening on port ' + port);
});
