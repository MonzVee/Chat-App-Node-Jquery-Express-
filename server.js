var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var axios = require('axios');

var chat = require('./routes/chat.routes');
require('./routes/chat.routes')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const uri = 'mongodb://muneer:ahmad786@cluster0-shard-00-00-72nuh.mongodb.net:27017,cluster0-shard-00-01-72nuh.mongodb.net:27017,cluster0-shard-00-02-72nuh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

mongoose.Promise = global.Promise;

mongoose.connect(uri);

mongoose.connection.on('error', function() {
  console.log('Connection to Mongo established');
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
mongoose.connection.once('open', function() {
  console.log("Successfully connected to the database");
});

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running . . ');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// opening a basic connection with socket.io
io.sockets.on('connection', function(socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(data) {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });
  //Send message functionality
  socket.on('send message', function(data) {
    io.sockets.emit('new message', {msg: data, user: socket.username});
    console.log("Message");
    console.log(JSON.stringify(data));
    console.log("User");
    console.log(socket.username);
    var username = socket.username;
    var text = data;
    axios.post('/history', {
    user: username,
    text: text
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log("Is the error here?");
    console.log(error);
  });
  });

  //New users
  socket.on('new user', function(data, callback) {
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
  });
  function updateUsernames(){
    io.sockets.emit('get users', users);
  }
});
