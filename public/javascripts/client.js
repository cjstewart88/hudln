(function() {
	var socket          = io.connect(null);
	
	var realm           = document.getElementById("realm");
	
	var myClientId      = 0;
	var myX             = 0;
	var myY             = 0;
	
	socket.on('connect', function () {
	  socket.on('init', function (data) {
      myClientId = data.clientId;
	    drawRealm(data.clientsView);
	  });
	  
	  socket.on('drawRealm', function (data) {
	    drawRealm(data.clientsView);
	  });
	});
  
  function drawRealm (clientsView) {
    // clear the canvas for redrawing
    realm.width   = realm.height = 0;
    realm.width   = 800; 
    realm.height  = 600;
    
    var clientsView = clientsView;
    
    // plot the currently connected clients
    $.each(clientsView, function (client) {
      var realm_context = realm.getContext('2d');
      realm_context.fillRect(clientsView[client][0], clientsView[client][1], 16, 16);
    });
  }
  
	$(document).ready(function () { 
	  // Movement
  	$(document).keydown(function (event) {
  	  var keyPressed = event.keyCode;
  	     
      if      (keyPressed == 37)  myX -= 10; //left
      else if (keyPressed == 39)  myX += 10; //right
      else if (keyPressed == 38)  myY -= 10; //up
      else if (keyPressed == 40)  myY += 10; //down
                    
      // if the key pressed is any of the arrow keys the user is moving, send the new position    
      if (keyPressed >= 37 && keyPressed <= 40) { 
        event.preventDefault();
        socket.emit('moveClient', { clientX: myX, clientY: myY } );
      }
	  });
	});
})();