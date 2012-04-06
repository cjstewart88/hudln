(function() {
	var socket          = io.connect(null);

	var realm           = document.getElementById("realm");
  var realm_context   = realm.getContext('2d');
	var clients         = {};

	var my_client_id     = 0;

	socket.on('connect', function () {
	  socket.on('init', function (data) {
	    my_client_id = data.client_id;
  	  clients     = data.init_client_list;
	    draw_realm();
	  });

	  socket.on('client_connected', function (data) {
	    clients[data.client_id] = [data.x, data.y, 23, 64];
	    draw_realm();
	  });

	  socket.on('client_moved', function (data) {
	    who				= data.client_id;
			direction = data.direction;

	    if (direction == "left") {
				clients[who][0] = clients[who][0]-10;
				clients[who][3] = 96;
      } 
			else if (direction == "right") {
				clients[who][0] = clients[who][0]+10;
				clients[who][3] = 32;
      } 
			else if (direction == "up") {
				clients[who][1] = clients[who][1]-10;
				clients[who][3] = 0;
      } 
			else if (direction == "down") {
				clients[who][1] = clients[who][1]+10;
				clients[who][3] = 64;
      }

      (clients[who][2]+23 <= 46 ? clients[who][2] += 24 : clients[who][2] = 0);

	    draw_realm();
	  });

	  socket.on('client_disconnected', function (data) {
	    delete clients[data.client_id];
	    draw_realm();
	  });
	});

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
		
    var character = new Image();
    character.src = "images/char3.png";
    
    character.onload = function() {
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
    };
  }
  
	$(document).ready(function () { 
	  // Client Movement
  	$(document).keydown(function (e) {  	     
      if      (e.keyCode == 37) direction = "left";
      else if (e.keyCode == 39) direction = "right";
      else if (e.keyCode == 38) direction = "up";
      else if (e.keyCode == 40) direction = "down";

      // if the key pressed is any of the arrow keys the user is 
      // moving, send the new position and prevent scrolling with the arrow keys   
      if (direction) { 
        event.preventDefault();
        socket.emit('request_to_move_client', { direction: direction } );
      }
	  });
	});
})();