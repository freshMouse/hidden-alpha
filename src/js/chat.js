var config = {
    apiKey: "AIzaSyA95v8pnveM1oyxb9cSAI4Ra2-5zulSjXU",
    authDomain: "hidden-alpha.firebaseapp.com",
    databaseURL: "https://hidden-alpha.firebaseio.com",
    projectId: "hidden-alpha",
    storageBucket: "hidden-alpha.appspot.com",
    messagingSenderId: "981849727385"
};
firebase.initializeApp(config);

const socket = io();
const $messages = $('#messages');
const $text = $('#text');
const $send = $('#send');
const user = $('#user').html();

const users = ['harvey', 'long'];

const db = firebase.database();
let value, currentValue, index;
db.ref('chats/').once('value').then((snap) => {
  value = snap.val();

  for(var i = 1; i < value.length; i++) {
    currentValue = value[i];
    if(Object.keys(currentValue)[0] === user) {
      $messages.append($('<div class="myself">').text(currentValue[user]));
      $messages.append('<br/>');
    } else {
      index = !users.indexOf(user);
      $messages.append($('<div class="otherPeople">').text(currentValue[users[+index]]));
      $messages.append('<br/>');
    }
  }
});

autosize($text);

$text.keydown((event) => {
  console.log('hi');
  if(event.which === 13) {
    $send.click();
  }
});

let textValue = '';
$send.click(() => {
  textValue = $text.val();
  $messages.append($('<div class="myself">').text(textValue));
  $messages.append('<br/>');
  socket.emit('chat message', {msg: textValue, user: user});
  $text.val('');
});

socket.on('display message', function(msg) {
  $messages.append($('<div class="otherPeople">').text(msg));
  $messages.append('<br/>');
});
