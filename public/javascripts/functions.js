$(document).ready(function() {
    var socket = io();
    $('form').submit(function() {
        var message = {
            msg: $('#m').val(),
            created_at: Date.now(),
        };
        socket.emit('chat message', JSON.stringify(message));
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        var data = JSON.parse(msg);
        var date = new Date(data.created_at);
        $('#messages').append($('<li>').text(data.username + ': ' + data.msg + ' | ' + date.toLocaleTimeString()));
    });

});
