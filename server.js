var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var db = require("mysql");
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
app.use(cookieParser());
var connection = db.createConnection({
  host:"127.0.0.1", user:"root",
  password:"Qwerty_123", database:"lab2"
  });
connection.connect(function(err){
  if (err) { console.log(err); return;}
  console.log("connection established");
  });


var options = {
  host: "127.0.0.1",
  user: 'root',
  password: 'Qwerty_123',
  database: 'lab2'
  };
  app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: new SessionStore(options),
  resave: true,
  saveUninitialized: true
  }))
// http://localhost:8080/



app.get('/', function(req, res) { 
  connection.query("select * from games where 2nd_join IS NULL AND 1st_join IS NOT NULL", 
  function(err, rows){ 
  if (err){console.log(err);return;} 
  if (rows[0]) req.session.user='user2'; 
  else req.session.user='user1'; 
  
  }); 
  res.sendfile('main.html'); 
  }); 
  /*app.get('/', function(req, res) { 
  req.session.user = "user1"; 
  res.sendfile('main.html'); 
  });*/ 
  app.get('/user', function(req, res) { 
  var object = {user:req.session.user}; 
  res.end(JSON.stringify(object)); 
  }); 
  app.post('/firstjoined', jsonParser, function (req, res) { 
  
  if(!req.body) return res.sendStatus(400); 
  connection.query("select * from games", 
  function(err, rows){ 
  if (err){console.log(err);return;} 
  //console.log(JSON.stringify(rows)); 
  var games = JSON.stringify(rows); 
  var data = JSON.parse(games); 
  var idgames = 0; 
  if (data.length > 0){ 
  for (var i =0; i<data.length;i++ ){ 
  if (data[i].idgames > idgames) idgames = data[i].idgames; 
  } 
  } 
  idgames = idgames+1; 
  connection.query("INSERT INTO `games` (`idgames`, `1st_join`) VALUES (?,?)", [idgames, req.body.firstjoined], function(err, rows){ 
  if (err){ 
  console.log(err); 
  return; 
  } 
  }); 
  }); 
  }); 
  app.post('/secondjoined', jsonParser, function (req, res) { 
  
  if(!req.body) return res.sendStatus(400); 
  connection.query("select * from games", 
  function(err, rows){ 
  if (err){console.log(err);return;} 
  //console.log(JSON.stringify(rows)); 
  var games = JSON.stringify(rows); 
  var data = JSON.parse(games); 
  var idgames = 0; 
  if (data.length > 0){ 
  for (var i =0; i<data.length;i++ ){ 
  if (data[i].idgames > idgames) idgames = data[i].idgames; 
  } 
}
  connection.query("update games set 2nd_join=? where idgames=?", [req.body.secondjoined, idgames], function(err, rows){ 
  if (err){ 
  console.log(err); 
  return; 
  } 
  }); 
  }); 
  }); 
  app.get('/battlefield1', function(req, res) { 
  res.sendfile('battlefield1.html'); 
  }); 
  app.get('/battlefield2', function(req, res) { 
  res.sendfile('battlefield2.html'); 
  }); 
  
var ships1, ships2;
app.get('/getships1', function(req, res) { 
  ships1 = res;
});

app.get('/getships2', function(req, res) { 
  ships2 = res;
});

app.post('/1stsended', jsonParser, function (req, res) { 
  
  if(!req.body) return res.sendStatus(400); 
ships2.end(req);
});

app.post('/2ndsended', jsonParser, function (req, res) { 
  
  if(!req.body) return res.sendStatus(400); 
ships1.end(req);
});


  // запускаем сервер на порту 8080 
  app.listen(8080); 
  // отправляем сообщение 
  console.log('Сервер стартовал!');



