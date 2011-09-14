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
    
    // all the data the client can see
    var clientsView = clientsView;
    
    // draw all the data in the clients range
    $.each(clientsView, function (client) {
      var realm_context = realm.getContext('2d');
      var plotX = 0;
      var plotY = 0;
      if (client == myClientId) {
        realm_context.fillStyle = 'rgb(0,0,0)';
        plotX = 400;
        plotY = 300;
      }
      else {
        realm_context.fillStyle = 'rgb(255,0,0)';
        // myX = 2000 
        // myY = 3000
        // some random player's X = 1500
        // some random player's  Y = 2500
        plotX = myX-clientsView[client][0]; // 500
        plotY = myY-clientsView[client][1]; // 500
        
        plotX = (plotX-400)*-1;
        plotY = (plotY-300)*-1;
      }
      realm_context.fillRect(plotX, plotY, 10, 10);
    
      // console.log("plotX: " + plotX + " plotY: "+ plotY);
    });
  }
  
	$(document).ready(function () { 
	  // Client Movement
  	$(document).keydown(function (event) {
  	  var keyPressed = event.keyCode;
  	     
      if      (keyPressed == 37)  { if (myX-10 >= 0)      { myX -= 10; } } //left
      else if (keyPressed == 39)  { if (myX+10 < 4000)    { myX += 10; } } //right
      else if (keyPressed == 38)  { if (myY-10 >= 0)      { myY -= 10; } } //up
      else if (keyPressed == 40)  { if (myY+10 < 3000)    { myY += 10; } } //down
                    
      // if the key pressed is any of the arrow keys the user is 
      // moving, send the new position and prevent scrolling with the arrow keys   
      if (keyPressed >= 37 && keyPressed <= 40) { 
        event.preventDefault();
        socket.emit('moveClient', { clientX: myX, clientY: myY } );
      }
	  });
	});
})();