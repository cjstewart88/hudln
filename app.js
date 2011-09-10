var sys = require('sys');
var express = require('express');
var io = require('socket.io');
var util = require('util');

var app = express.createServer();

app.configure(function() {
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.set("view options", {layout: false});
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  app.use(express.static(__dirname + '/public'));
});

// routes
app.get('/', function(req, res) {
  res.render('index');
});

app.listen(8080);

var io = io.listen(app);

var clients = [];

io.sockets.on('connection', function (client) {
  
  var clientId = clients.length;
  clients.push([clientId,0,0]);
  client.broadcast.emit('newClient', { client: clients[clientId] });
  client.emit('currentClients', { clientId: clientId, clients: clients });
  
});

