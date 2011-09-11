(function() {
	var socket          = io.connect(null);
	
	var clients         = {};
	var realm           = document.getElementById("realm");
	var realmDimensions = [0,0];
	
	var myClientId      = 0;
	var myX             = 0;
	var myY             = 0;
	
	socket.on('connect', function () {
	  socket.on('init', function (data) {
	    clients         = data.clients;
	    realmDimensions = [data.realmDimensions[0], data.realmDimensions[1]];
      myClientId      = data.clientId;
	    
	    drawRealm();
	  });
	  
	  socket.on('drawRealm', function (data) {
	    clients         = data.clients;
	    realmDimensions = [data.realmDimensions[0], data.realmDimensions[1]];
	    
	    drawRealm();
	  });
	});
  
  function drawRealm () {
    // clear the canvas for redrawing
    realm.width   = realm.height = 0;
    
    // adjust the canvas aka realm to its actual live dimensions
    realm.width   = realmDimensions[0];
    realm.height  = realmDimensions[1];
  
    // plot the currently connected clients
    $.each(clients, function (client) {
      var realm_context = realm.getContext('2d');
      realm_context.fillRect(clients[client][0], clients[client][1], 16, 16);
    });
  }
  
	$(document).ready(function () { 
  	$(document).keydown(function (event) {
  	    var numOfSteps  = 10;
  	    var oldX        = myX;
  	    var oldY        = myY;
  	    
        switch (event.keyCode) {
          case 37: // left
            if (myX-numOfSteps >= 0) { myX -= numOfSteps; }
            break;
          case 39: // right
            if (myX+numOfSteps >= realmDimensions[0]) { realmDimensions[0] += 50; }
            myX += numOfSteps;
            break;
          case 38: // up
            if (myY-numOfSteps >= 0) { myY -= numOfSteps; } 
            break;
          case 40: // down
            if (myY+numOfSteps >= realmDimensions[1]) { realmDimensions[1] += 50; }
            myY += numOfSteps;
            break;
        }
        
        if (oldX != myX || oldY != myY) {
          socket.emit('moveClient', { clientId: myClientId, clientX: myX, clientY: myY, realmDimensions: realmDimensions } );
        }
      });
	});
})();