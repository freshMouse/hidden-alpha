const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const firebase = require('firebase');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const config = {
    apiKey: "AIzaSyA95v8pnveM1oyxb9cSAI4Ra2-5zulSjXU",
    authDomain: "hidden-alpha.firebaseapp.com",
    databaseURL: "https://hidden-alpha.firebaseio.com",
    projectId: "hidden-alpha",
    storageBucket: "",
    messagingSenderId: "981849727385"
  };
firebase.initializeApp(config);

const db = firebase.database();

firebase.database().ref('chats/').remove();

app.set('view engine', 'pug');

app.use('/css', express.static(__dirname + '/src/css'));
app.use('/js', express.static(__dirname + '/src/js'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: 'ja8imnv8u/ iuw uu8K?LJHUU*UY*/j\\skf 8 \'\'Iua [ 9  tr[[]t0{}ljf00v0kljsuu7'
}));

app.get('/', function(req, res) {
  res.render(__dirname + "/src/index.pug");
});

app.post('/login', function(req, res) {
   db.ref('users').on('value', (snap) => {
     const password = snap.val()[req.body.name].password;
     bcrypt.compare(req.body.passsword, password, (err, result) => {
       if(err) {
         console.log(err);
         res.render(__dirname + '/src/index.pug');
       }
       if(result) {
         req.session.logged = true;
         res.redirect('/chat?user=' + req.body.name);
       } else {
         res.render(__dirname + '/src/index.pug');
       }
     });
  });
});

app.post('/reg', function(req, res) {
  if(req.body.code === 'long') {
    bcrypt.hash(req.body.regPasssword, 10, function(err, hash) {
      db.ref('users/' + req.body.regName).set({
        password: hash
      });
      res.redirect('/chat');
    });
  } else {
    res.redirect('/');
  }
});

app.get('/chat', function(req, res) {
  if(req.session.logged) {
    res.render(__dirname + '/src/chat.pug', {'user': req.query.user});
  } else {
    res.render(__dirname + '/src/index.pug');
  }
});

http.listen(8080);
console.log('listening at 8080');

let count = 1;
io.on('connection', (socket) => {
  console.log('1 new user');
  socket.on('chat message', function(data) {
    console.log({[data.user]: data.msg});
    db.ref('/chats/' + count).set({
      [data.user]: data.msg
    });

    count++;

    socket.broadcast.emit('display message', data.msg);
  });
  socket.on('disconnect', function() {
    console.log('1 user disconnected');
  });
});
