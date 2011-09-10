var express = require('express');
var io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.set("view options", {layout: false});
  
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.set('address', 'localhost');
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

if (!module.parent) {
  app.listen(app.settings.port);
  console.log("Server listening on port %d", app.settings.port);
}

// Start my Socket.io app and pass in the socket
require('./socketapp').start(io.listen(app));