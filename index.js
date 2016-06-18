var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
    res.send('<h1>Hello World!</h1>');
});

var port = 8000;
http.listen(port, function(){
    console.log('listenting on port ' + port);
});

/*
const net = require('net')

sockets = []

var server = net.createServer(function(socket){
    sockets.push(socket);
    console.log('user (' + socket.remoteAddress + ' | ' + socket.remotePort + ') has connected...');
    socket.write('\nwelcome to the chat server!\n\n')
    socket.write('please enter your username: ')

    socket.on('data', function(data){
        var message = String(data)

        if (socket.name === undefined){
            socket.name = message.trim('\n')
            send(socket.name + ' has connected to the chat server...\n', socket)
            socket.write('\n')
        } else{
            send(socket.name + ': ' + message, socket);
        }
    });

    socket.on('end', function(){
        sockets.splice(sockets.indexOf(socket), 1);
        send(socket.name + ' has disconnected from the chat server...\n')
        console.log('user (' + socket.remoteAddress + ' | ' + socket.remotePort + ') has disconnected...');
    });
});

function send(message, socket=null){
    for (i = 0; i < sockets.length; ++i){
        if (sockets[i] !== socket && socket.name !== undefined)
            sockets[i].write(message);
    }
}


server.listen(8000);
*/
