$(document).ready(function() {
  var socket = io();
  $('form').submit(function() {
    $.post('getGroups', function(groups) {
      console.log(groups);

      var message = {
        msg: $('#m').val(),
        created_at: Date.now(),
        groupId: groups['groups'][0],
      };

      $('#m').val('');
      $.post('addMessage', message, function(data) {
        console.log('ggwp');
        console.log(data);
      }, 'json');
    }, 'json');

    return false;
  });

  socket.on('chat message', function(msg) {
    var data = JSON.parse(msg);
    var date = new Date(data.created_at);
    $('#messages').append($('<li>').text(data.userId + ': ' + data.msg + ' | ' + date.toLocaleTimeString()));
  });
});
