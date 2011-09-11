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

var port = process.env.PORT || 3000;

app.listen(port);

var io = io.listen(app);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

var clients = {};

io.sockets.on('connection', function (client) {
  var clientId = client["id"];
  clients[clientId] = [0,0];
  client.broadcast.emit('newClient', { clientId: clientId });
  client.emit('currentClients', { clientId: clientId, clients: clients });
  
  client.on('moveClient', function (data) {
    clients[clientId] = [data.clientX, data.clientY];
    client.broadcast.emit('updateClientPosition', { clientId: clientId, clientX: data.clientX, clientY: data.clientY });
    client.emit('updateClientPosition', { clientId: clientId, clientX: data.clientX, clientY: data.clientY });
  });
  
  client.on('disconnect', function () {
    delete clients[clientId];
    client.broadcast.emit('updateClientPosition', { clientId: clientId, deleteClient: true });
  });
  
});

