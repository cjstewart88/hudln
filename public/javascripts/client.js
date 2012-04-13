(function() {
	var socket          = io.connect(null);

	var realm           = document.getElementById("realm");
  var realm_context   = realm.getContext('2d');
	var clients         = {};

	var my_client_id    = 0;
  var realm_items_available_to_client = null;
  
	socket.on('connect', function () {
	  socket.on('init', function (data) {
	    my_client_id  = data.client_id;
  	  clients       = data.init_client_list;
  	  realm_items_available_to_client = data.realm_items_available_to_client;
  	  
	    draw_realm();
	  });

	  socket.on('client_connected', function (data) {
	    clients[data.client_id] = [data.x, data.y];
	    draw_realm();
	  });

	  socket.on('client_moved', function (data) {
      save_move_locally(data.client_id, data.direction, data.new_value);
	  });

	  socket.on('client_disconnected', function (data) {
	    delete clients[data.client_id];
	    draw_realm();
	  });
	});

  function save_move_locally (client_moving_id, direction, new_value) {
    if      (direction == "left"  || direction == "right")  {
			clients[client_moving_id][0] = new_value;
    } 
		else if (direction == "up"    || direction == "down")   {
			clients[client_moving_id][1] = new_value;
    } 
    
    console.log("x: "+clients[client_moving_id][0]+" y: "+clients[client_moving_id][1]);
    
    draw_realm();
  }

  var character = new Image();
  character.src = "images/char3.png";

  function draw_realm () {
    // my cords
    var my_x = clients[my_client_id][0];
    var my_y = clients[my_client_id][1];

    // clear the canvas for redrawing
    realm.width   = realm.height = 0;
    realm.width   = 800; 
    realm.height  = 600;

		// draw realm boundaries if players anywhere near them
		realm_context.fillStyle = 'rgb(0,0,0)';
		if      (my_y < 300)  realm_context.fillRect(0 , 0, 800, 300-my_y)
		else if (my_y > 1600) realm_context.fillRect(0, 2320-my_y, 800, 300);

		if      (my_x < 400)  realm_context.fillRect(0, 0, 400-my_x, 600);
		else if (my_x > 1600) realm_context.fillRect(2420-my_x, 0, 400, 600);
		
    // draw all the clients
    $.each(clients, function (client) {
      if (client == my_client_id) {
        realm_context.fillStyle = 'rgb(74, 23, 197)';
        
        plot_x = 400;
        plot_y = 300;
      }
      else {
        realm_context.fillStyle = 'rgb(25, 23, 36)';
      
        plot_x = (my_x-clients[client][0]-400)*-1;
        plot_y = (my_y-clients[client][1]-300)*-1;
      }
      
  		realm_context.fillRect(plot_x, plot_y, 20, 20);
    });
    
    // draw all the client specific realm items
    $.each(realm_items_available_to_client, function (item) {
      plot_x = (my_x-this.item_x-400)*-1;
      plot_y = (my_y-this.item_y-300)*-1;
      
  		realm_context.fillStyle = 'rgb(234, 44, 70)';
  		realm_context.fillRect(plot_x, plot_y, 10, 10);
    });
  }
  
  // Client Contols
	$(document).keydown(function (e) { 
	  var key = e.keyCode;
	   
	  if (key == 32) {
	    pickup_item(event);
	  }
	  else if (key == 37 || key == 39 || key == 38 || key == 40) {
	    client_movement(key);
	  }
  });
  
  function pickup_item () {
    event.preventDefault();
    
    my_x = clients[my_client_id][0];
    my_y = clients[my_client_id][1];
      
    $.each(realm_items_available_to_client, function () {
      var dx = this.item_x - my_x;
      var dy = this.item_y - my_y;
      
      if (dx * dx + dy * dy <= 25 * 25) {
        console.log("close to item");
      }
    });
  }
  
  function client_movement (key) {
    event.preventDefault();
    
    var direction = null;
	  
    if      (key == 37) direction = "left";
    else if (key == 39) direction = "right";
    else if (key == 38) direction = "up";
    else if (key == 40) direction = "down";
          
    // attempt to move locally up front to reduce lag and to prevent sending a request to the serve if the upfront 
    // check does not legitly pass
    var new_value = null;
          
    if      (direction == "left"  && clients[my_client_id][0]-10 >= 0     && clients[my_client_id][0] != 0)     new_value = clients[my_client_id][0]-10
    else if (direction == "right" && clients[my_client_id][0]+10 <= 2000  && clients[my_client_id][0] != 2000)  new_value = clients[my_client_id][0]+10
    else if (direction == "up"    && clients[my_client_id][1]-10 >= 0     && clients[my_client_id][1] != 0)     new_value = clients[my_client_id][1]-10
    else if (direction == "down"  && clients[my_client_id][1]+10 <= 2000  && clients[my_client_id][1] != 2000)  new_value = clients[my_client_id][1]+10

    if (new_value != null) {
      save_move_locally(my_client_id, direction, new_value);

      // send the request to the server to prevent cheating if the user some how moved beyond the 
      // realm's boundaries the server will pull them back
      socket.emit('request_to_move_client', { direction: direction, new_value: new_value } );
    }
  }
})();