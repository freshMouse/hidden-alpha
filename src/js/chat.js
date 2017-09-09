const socket = io();
const $messages = $('#messages');
const $text = $('#text');
const $send = $('#send');

$text.keydown((event) => {
  console.log('hi');
  if(event.which === 13) {
    $send.click();
  }
});

let textValue = '';
$send.click(() => {
  textValue = $text.val();
  $messages.append($('<li id="myself">').text(textValue));
  $messages.append('<br/>');
  socket.emit('chat message', textValue);
  $text.val('');
});

socket.on('display message', function(msg) {
  $messages.append($('<li>').text(msg));
});

