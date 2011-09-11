(function() {
	var socket = io.connect(null);
	
	var clients = {};
	
	var myClientId;
	var myX = 0;
	var myY = 0;
	
	socket.on('connect', function () {
	  socket.on('currentClients', function (data) {
      myClientId = data.clientId;
	    clients = data.clients;
      $.each(clients, function(client) {
        $('body').append('<div id="'+client+'" style="top: '+clients[client][1]+'; left: '+clients[client][0]+'"></div>');
      });
	  });
	  
  	socket.on('newClient', function (data) {
  	  $('body').append('<div id="'+data.clientId+'" style="top: '+0+'; left: '+0+'"></div>');
  	});
  	
  	socket.on('updateClientPosition',function (data) {
  	  if (!data.deleteClient) {
  	    clients[data.clientId] = [data.clientId, data.clientX, data.clientY];
  	    $('body').find('#'+data.clientId).css({ 'top': data.clientY, 'left': data.clientX });
  	  }
  	  else {
  	    clients[data.clientId] = null;
  	    $('body').find('#'+data.clientId).remove();
  	  }
  	});
	});
  
	$(document).ready(function () { 
  	$(document).keydown(function (e) {
  	  console.log("uhhh");
  	    var oldX = myX;
  	    var oldY = myY;
  	    
        switch (e.keyCode) {
          case 37: // left
            if (myX-1 >= 0) { myX--; }
            break;
          case 39: // right
            myX++;
            break;
          case 38: // up
            if (myY-1 >= 0) { myY--; } 
            break;
          case 40: // down
            myY++;
            break;
        }
        
        if (oldX != myX || oldY != myY) {
          socket.emit('moveClient', { clientId: myClientId, clientX: myX, clientY: myY } );
        }
      });
	});
})();