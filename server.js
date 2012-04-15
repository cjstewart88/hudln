var express = require('express');
var io      = require('socket.io');
var redis   = require('redis');

var config = require('./config');

var server  = express.createServer();
var port    = process.env.PORT || 3000;

server.configure(function() {
  server.set('view engine', 'html');
  server.set('views', __dirname + '/views');
  server.set('view options', {layout: false});
  server.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  server.use(express.static(__dirname + '/public'));
});

// routes
server.get('/', function(req, res) {
  res.render('index');
});

server.listen(port);

/*    REDIS SERVER    */
var redis_server = redis.createClient(config.prod_redis_port, config.prod_redis_server)
redis_server.auth(config.prod_redis_key);

/*    SOCKET.IO SHIT    */
var io = io.listen(server);

// handler for when a new client connects
io.sockets.on('connection', function (client) {
  // setup new clients stuff
  var client_id = client['id'];
  var realm_items_available_to_client = generate_items();
  
  // add the new client to the 'clients' set in redis
  // one day this will check to see if the client that connected is already a client 
  // and basically just "sign them in" and mark them connected
  redis_server.sadd("clients", "client:"+client_id);
  redis_server.hmset("client:"+client_id, "client_id", client_id, "status", "connected", "x", 0, "y", 0);

  // get the list of currently connected clients and also let already connected 
  // clients know about the new user
  redis_server.smembers("clients", function (err, clients) {
    var init_client_list = {};
    var client_count = 0;

    for (var thisclient_id in clients) {
      redis_server.hgetall(clients[thisclient_id], function (err, client_data) {
        if (client_data["status"] == "connected") {
          init_client_list[client_data["client_id"]] = [parseInt(client_data["x"]), parseInt(client_data["y"])];
        }

        client_count++

        // we only need to send our messages when all the currently connected clients are added to the 'init_client_list'
        if (client_count == clients.length) {
          // send the init action to get the newly connected client started
          client.emit('init', { client_id: client_id, init_client_list: init_client_list, realm_items_available_to_client: realm_items_available_to_client });  
          // let the already connected clients know about the newly connected client
          client.broadcast.emit('client_connected', { client_id: client_id, x: 0, y: 0 }); 
          // we dont need this anymore after its been sent
          init_client_list = null; 
        }
      });
    }
  });

  // clients requesting to move
  client.on('request_to_move_client', function (data) {
    var direction = data.direction;
    var new_value = data.new_value;
    
    redis_server.hgetall("client:"+client_id, function (err, client) {
      var x   = parseInt(client["x"]);
      var y   = parseInt(client["y"]);

      if      (direction == "left"  && x-10 >= 0    )  redis_server.hset("client:"+client_id, "x", new_value, function() { client_moved(); });
      else if (direction == "right" && x+10 <= 2000 )  redis_server.hset("client:"+client_id, "x", new_value, function() { client_moved(); });
      else if (direction == "up"    && y-10 >= 0    )  redis_server.hset("client:"+client_id, "y", new_value, function() { client_moved(); });
      else if (direction == "down"  && y+10 <= 2000 )  redis_server.hset("client:"+client_id, "y", new_value, function() { client_moved(); });
    }); 
    
    function client_moved () {
      client.broadcast.emit('client_moved', { client_id: client_id, direction: direction, new_value: new_value });
    }
  });

  // client disconnected
  client.on('disconnect', function () {
    redis_server.hset("client:"+client_id, "status", "disconnected");
    client.broadcast.emit('client_disconnected', { client_id: client_id });
  });
});

function generate_items () {
  var generated_items = [];
  
  for (var i = 0; i < 100; i++) {
    generated_items.push({
      item_id:  i,
      item_x:   Math.floor(Math.random()*190)*10,
      item_y:   Math.floor(Math.random()*190)*10
    })
  }
  
  return generated_items;
}