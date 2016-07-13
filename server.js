/* jshint esversion: 6 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const passportSocketIo = require('passport.socketio');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const env = require('dotenv').config();

const index = require('./routes/index');
const login = require('./routes/login');
const dbHandler = require('./lib/mongo.js');
const authHandler = require('./lib/auth.js');
const groupHandler = require('./lib/group.js');

var dbPath = 'mongodb://localhost/chat_server';

var sessionStore = new mongoStore({
  url: dbPath,
});

dbHandler(function(err, mongo) {
  if (err) throw err;

  var auth = authHandler(mongo, {success:'/', failure:'/login'});
  var group = groupHandler(mongo);

  app.use(morgan('tiny'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', login);

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/login', auth.auth);
  app.use(auth.checkAuth);
  app.use('/', index);

  /* ----------------------------------------------------------------------------- */

  io.on('connection', function(socket) {
    console.log('user connected');

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

    socket.on('add message', function(message) {
      var data = JSON.parse(message);
      auth.getUsername(socket.request.user, function(username) {
        data.userId = socket.request.user;
        console.log('chat message: ', data);
        group.addMessage(data.groupId, message);
        // group.createGroup('test', socket.request.user);
        io.emit('chat message', JSON.stringify(data));
			});
    });

    socket.on('get messages', function(groupdId) {
      group.getMessages(groupId, function(messages) {
        var data = {messages: messages};
        socket.emit('get messages', JSON.stringify(data));
      });
    });

    socket.on('get groups', function() {
      group.getGroups(socket.request.user, function(groups) {
        var data = {groups: groups};
        console.log('at groups');
        socket.emit('get groups', JSON.stringify(data));
      });
    });
  });


  /* ----------------------------------------------------------------------------- */

  //With Socket.io >= 1.0 
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express 
    key:          'connect.sid',       // the name of the cookie where express/connect stores its session_id 
    secret:       process.env.SESSION_SECRET,    // the session_secret to parse the cookie 
    store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please 
    success:      onAuthorizeSuccess,  // *optional* callback on success - read more below 
    fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below 
  }));
   
  function onAuthorizeSuccess(data, accept){
    console.log('successful connection to socket.io');
   
    // If you use socket.io@1.X the callback looks different 
    accept();
  }
   
  function onAuthorizeFail(data, message, error, accept){
    if(error)
      throw new Error(message);
    console.log('failed connection to socket.io:', message);
   
    // If you don't want to accept the connection 
    if(error)
      accept(new Error(message));
    // this error will be sent to the user as a special error-package 
    // see: http://socket.io/docs/client-api/#socket > error-object 
  }

});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/* ----------------------------------------------------------------------------- */

var port = 8000;
http.listen(port, function() {
  console.log('listening on port ' + port);
});
