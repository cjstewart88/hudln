(function() {

	var socket = io.connect('http://127.0.0.1:8080');
	
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
        if(e.keyCode == 37) { myX--; } // left
        if(e.keyCode == 39) { myX++; } // right
        if(e.keyCode == 38) { myY--; } // up
        if(e.keyCode == 40) { myY++; } // down
        
        socket.emit('moveClient', { clientId: myClientId, clientX: myX, clientY: myY } );
      });
		
	});
	
})();