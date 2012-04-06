(function() {
	var socket          = io.connect(null);

	var realm           = document.getElementById("realm");
  var realm_context   = realm.getContext('2d');
	var clients         = {};

	var my_client_id    = 0;

	socket.on('connect', function () {
	  socket.on('init', function (data) {
	    my_client_id  = data.client_id;
  	  clients       = data.init_client_list;
	    draw_realm();
	  });

	  socket.on('client_connected', function (data) {
	    clients[data.client_id] = [data.x, data.y, 23, 64];
	    draw_realm();
	  });

	  socket.on('client_moved', function (data) {
	    console.log(data);
      save_move_locally(data.client_id, data.direction, data.new_value);
	  });

	  socket.on('client_disconnected', function (data) {
	    delete clients[data.client_id];
	    draw_realm();
	  });
	});

  function save_move_locally (client_moving_id, direction, new_value) {
    if (direction == "left") {
			clients[client_moving_id][0] = new_value;
			clients[client_moving_id][3] = 96;
    } 
		else if (direction == "right") {
			clients[client_moving_id][0] = new_value;
			clients[client_moving_id][3] = 32;
    } 
		else if (direction == "up") {
			clients[client_moving_id][1] = new_value;
			clients[client_moving_id][3] = 0;
    } 
		else if (direction == "down") {
			clients[client_moving_id][1] = new_value;
			clients[client_moving_id][3] = 64;
    }
    
    (clients[client_moving_id][2]+23 <= 46 ? clients[client_moving_id][2] += 24 : clients[client_moving_id][2] = 0);

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
    realm.width   = 825; 
    realm.height  = 632;

		// draw realm boundaries if players anywhere near them
		realm_context.fillStyle = 'rgb(0,0,0)';
		if (my_y <= 300)   realm_context.fillRect(0 ,0, 825, 300-my_y);
		if (my_x <= 800)   realm_context.fillRect(0, 0, 400-my_x, 632);
		if (my_y >= 2500)  realm_context.fillRect(0, 3325-my_y, 825, 300); 
		if (my_x >= 3500)  realm_context.fillRect(4432-my_x, 0, 400, 632);
		
    // draw all the data in the clients range
    $.each(clients, function (client) {
      // draw clients
      if (client == my_client_id) {
        realm_context.fillStyle = 'rgb(255,0,0)';
        plot_x = 400;
        plot_y = 300;
      }
      else {
        realm_context.fillStyle = 'rgb(255,255,0)';
        plot_x = my_x-clients[client][0];
        plot_y = my_y-clients[client][1];

        plot_x = (plot_x-400)*-1;
        plot_y = (plot_y-300)*-1;
      }
      
      realm_context.drawImage(character, clients[client][2], clients[client][3], 25, 32, plot_x, plot_y, 24, 32);
    });
  }
  
  // Client Movement
	$(document).keydown(function (e) {  	 
	  var direction = null;
	  
    if      (e.keyCode == 37) direction = "left";
    else if (e.keyCode == 39) direction = "right";
    else if (e.keyCode == 38) direction = "up";
    else if (e.keyCode == 40) direction = "down";
    
    // if a direction was set lets attempt to move the character
    if (direction) { 
      event.preventDefault();
      
      // attempt to move locally up front to reduce lag and to prevent sending a request to the serve if the upfront 
      // check does not legitly pass
      var new_value = null;
            
      if      (direction == "left"  && clients[my_client_id][0]-10 >= 0     && clients[my_client_id][0] != 0)     new_value = clients[my_client_id][0]-10
      else if (direction == "right" && clients[my_client_id][0]+10 <= 4000  && clients[my_client_id][0] != 4000)  new_value = clients[my_client_id][0]+10
      else if (direction == "up"    && clients[my_client_id][1]-10 >= 0     && clients[my_client_id][1] != 0)     new_value = clients[my_client_id][1]-10
      else if (direction == "down"  && clients[my_client_id][1]+10 <= 3000  && clients[my_client_id][1] != 3000)  new_value = clients[my_client_id][1]+10

      if (new_value != null) {
        save_move_locally(my_client_id, direction, new_value);

        // send the request to the server to prevent cheating if the user some how moved beyond the 
        // realm's boundaries the server will pull them back
        socket.emit('request_to_move_client', { direction: direction, new_value: new_value } );
      }
    }
  });
})();