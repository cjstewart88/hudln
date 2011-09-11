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

var clients = [];

io.sockets.on('connection', function (client) {
  
  var clientId = clients.length;
  clients.push([clientId,0,0]);
  client.broadcast.emit('newClient', { client: clients[clientId] });
  client.emit('currentClients', { clientId: clientId, clients: clients });
  
  client.on('moveClient', function(data) {
    clients[data.clientId] = [data.clientId, data.clientX, data.clientY];
    client.broadcast.emit('updateClientPosition', { clientId: data.clientId, clientX: data.clientX, clientY: data.clientY });
    client.emit('updateClientPosition', { clientId: data.clientId, clientX: data.clientX, clientY: data.clientY });
  });
  
});

