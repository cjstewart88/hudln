(function() {
	var socket          = io.connect(null);
	
	var clients         = {};
	var realm           = document.getElementById("realm");
	var realmDimensions = [0, 0];
	
	var myClientId      = 0;
	var myX             = 0;
	var myY             = 0;
	var oldX            = 0;
	var oldY            = 0;
	
	var windowWidth     = 0;
	var windowHeight    = 0;
	var leftOffset      = 0;
	var topOffset       = 0;
	
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
  
  function scrollRealm () {
    if (myX > oldX || myY > oldY) { // scrolling if the user is moving right or down
      if (myX >= leftOffset-50) { 
        $('html, body').animate({ scrollLeft: leftOffset-400 }, 2000); 
        leftOffset += windowWidth-400; 
      }
      if (myY >= topOffset-50) { 
        $('html, body').animate({ scrollTop: topOffset-200 }, 2000); 
        topOffset += windowHeight-200; 
      }
    }
    else { // scrolling if th user is moving left or up
    }
  }
  
  function drawRealm () {
    // clear the canvas for redrawing
    realm.width   = realm.height = 0;
    
    // adjust the canvas aka realm to its actual live dimensions
    realm.width   = realmDimensions[0];
    realm.height  = realmDimensions[1];
    $('#realm').css({ 'margin-right': windowWidth+'px','margin-bottom': windowHeight+'px' });
    
    // plot the currently connected clients
    $.each(clients, function (client) {
      var realm_context = realm.getContext('2d');
      realm_context.fillRect(clients[client][0], clients[client][1], 16, 16);
      
      // addjust the clients view port if needed to keep them on the screen when moving
      if (client == myClientId) {
        scrollRealm();
      }
    });
  }
  
	$(document).ready(function () { 
	  windowWidth         = $(window).width();
	  windowHeight        = $(window).height();
	  leftOffset          = $(window).width();
	  topOffset           = $(window).height();

	  // Movement
  	$(document).keydown(function (event) {
  	    var keyPressed  = event.keyCode;
  	    var numOfSteps  = 10;
  	    var explore     = 200;  /*  Number of pixels the user has to be before he/she 
  	                                explores new parts of the realm. Also how much(in pixels)
  	                                the user explores. */
  	    oldX            = myX;
  	    oldY            = myY;
        
        if (keyPressed >= 37 && keyPressed <= 40) event.preventDefault();
        
        if (keyPressed == 37) { // left
          if (myX-numOfSteps >= 0) { myX -= numOfSteps; } 
        }
        else if (keyPressed == 39) { // right
          if (myX+explore >= realmDimensions[0]) { realmDimensions[0] += explore; } 
          myX += numOfSteps;
        }
        else if (keyPressed == 38) { // up
          if (myY-numOfSteps >= 0) { myY -= numOfSteps; } 
        }
        else if (keyPressed == 40) { // down
          if (myY+explore >= realmDimensions[1]) { realmDimensions[1] += explore; }
          myY += numOfSteps;
        }
                
        if (oldX != myX || oldY != myY) {
          socket.emit('moveClient', { clientId: myClientId, clientX: myX, clientY: myY, realmDimensions: realmDimensions } );
        }
      });
	});
	
	$(document).mousewheel(function(event) { event.preventDefault(); });
})();