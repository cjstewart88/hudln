(function() {
	var socket          = io.connect(null);
	
	var realm           = document.getElementById("realm");
  var realm_context   = realm.getContext('2d');
	var clients         = {};
	
	var myClientId      = 0;
	
	socket.on('connect', function () {
	  socket.on('init', function (data) {
	    myClientId  = data.clientId;
  	  clients     = data.initClientList;
	    drawRealm();
	  });
	  
	  socket.on('clientConnected', function (data) {
	    clients[data.clientId] = [data.x, data.y];
	    drawRealm();
	  });
	  	  
	  socket.on('clientMoved', function (data) {
	    clientThatMoved = data;
	    
	    if      (clientThatMoved.direction == "left")  clients[clientThatMoved.clientId][0] = clients[clientThatMoved.clientId][0]-100;
      else if (clientThatMoved.direction == "right") clients[clientThatMoved.clientId][0] = clients[clientThatMoved.clientId][0]+100;
      else if (clientThatMoved.direction == "up")    clients[clientThatMoved.clientId][1] = clients[clientThatMoved.clientId][1]-100;
      else if (clientThatMoved.direction == "down")  clients[clientThatMoved.clientId][1] = clients[clientThatMoved.clientId][1]+100;
      
	    drawRealm();
	  });
	  
	  socket.on('clientDisconnected', function (data) {
	    delete client[data.clientId];
	    
	    drawRealm();
	  });
	});
  
  function drawRealm () {
    console.log(clients);
    // my cords
    var myX = clients[myClientId][0];
    var myY = clients[myClientId][1];
    
    // clear the canvas for redrawing
    realm.width   = realm.height = 0;
    realm.width   = 810; 
    realm.height  = 610;
        
    // draw all the data in the clients range
    $.each(clients, function (client) {
      // draw realm boundaries
      realm_context.fillStyle = 'rgb(0,0,0)';
      if (myY <= 300)   realm_context.fillRect(0 ,0, 810, 300-myY);
      if (myX <= 800)   realm_context.fillRect(0, 0, 400-myX, 610);
      if (myY >= 2500)  realm_context.fillRect(0, 3310-myY, 810, 300); 
      if (myX >= 3500)  realm_context.fillRect(4410-myX, 0, 400, 610);
      
      // draw clients
      var plotX = 0;
      var plotY = 0;
      if (client == myClientId) {
        realm_context.fillStyle = 'rgb(255,0,0)';
        plotX = 400;
        plotY = 300;
      }
      else {
        realm_context.fillStyle = 'rgb(255,255,0)';
        // myX = 2000  myY = 3000
        // some random player's X = 1500
        // some random player's  Y = 2500
        plotX = myX-clients[client][0]; // 500
        plotY = myY-clients[client][1]; // 500
        
        plotX = (plotX-400)*-1;
        plotY = (plotY-300)*-1;
      }
      
      realm_context.fillRect(plotX, plotY, 10, 10);
    });
  }
  
	$(document).ready(function () { 
	  // Client Movement
  	$(document).keydown(function (event) {
  	  var keyPressed  = event.keyCode;
  	  var direction   = null;
  	     
      if      (keyPressed == 37)  direction = "left";
      else if (keyPressed == 39)  direction = "right";
      else if (keyPressed == 38)  direction = "up";
      else if (keyPressed == 40)  direction = "down";
                    
      // if the key pressed is any of the arrow keys the user is 
      // moving, send the new position and prevent scrolling with the arrow keys   
      if (direction) { 
        event.preventDefault();
        socket.emit('requestToMoveClient', { direction: direction } );
      }
	  });
	});
})();