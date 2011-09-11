(function() {

	var socket = io.connect(null);
	
	var clients = [];
	
	var myClientId;
	var myX = 0;
	var myY = 0;
	
	socket.on('connect', function () {
	  socket.on('currentClients', function (data) {
	    clients = data.clients;
	    myClientId = data.clientId;
      $.each(clients, function() {
        $('body').append('<div id="'+this[0]+'" style="top: '+this[1]+'; left: '+this[2]+'"></div>');
      });
	  });
	  
  	socket.on('newClient', function (data) {
  	  $('body').append('<div id="'+data.client[0]+'" style="top: '+data.client[1]+'; left: '+data.client[2]+'"></div>');
  	});
  	
  	socket.on('updateClientPosition',function (data) {
  	  clients[data.clientId] = [data.clientId, data.clientX, data.clientY];
  	  $('body').find('#'+data.clientId).css({ 'top': data.clientY, 'left': data.clientX })
  	});
	});
  
	$(document).ready(function (){ 	
    
  	$(document).keydown(function (e) {
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