var sys = require('sys');
var express = require('express');
var io = require('socket.io');

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

var socket = io.listen(app);

socket.on('connection', function (client) {
    client.on('message', function (message) {
        socket.broadcast(message);
    });
});