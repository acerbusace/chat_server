$(document).ready(function() {
  var socket = io();
  $('form').submit(function() {
    console.log('at submit');
    socket.emit('get groups');
    console.log('at get gg');
    socket.on('get groups', function(groups) {
      console.log('at groups');
      console.log(groups);
      groups = JSON.parse(groups);

      var message = {
        msg: $('#m').val(),
        created_at: Date.now(),
        groupId: groups['groups'][0],
      };

      $('#m').val('');

      console.log(message);

      socket.emit('add message', JSON.stringify(message));
    });
    
    return false;
  });

  socket.on('chat message', function(msg) {
    var data = JSON.parse(msg);
    var date = new Date(data.created_at);
    $('#messages').append($('<li>').text(data.userId + ': ' + data.msg + ' | ' + date.toLocaleTimeString()));
  });

});
