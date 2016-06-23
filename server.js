#!/usr/bin/node

/* jshint esversion: 6 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const index = require('./routes/index');
const login = require('./routes/login');
const path = require('path');

app.use('/', index);
app.use('/', login);

app.set('views', path.join(__dirname, 'views'));


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
