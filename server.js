const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const firebase = require('firebase');
const app = express();

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
         res.redirect('/chat');
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
  console.log('chat');
  if(req.session.logged) {
    res.render(__dirname + '/src/chat.pug');
  } else {
    res.render(__dirname + '/src/index.pug');
  }
});

app.listen(8080);
console.log('listening at 8080');
