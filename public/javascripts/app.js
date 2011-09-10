(function() {

	var socket = io.connect('http://127.0.0.1:8080');
	var clients = [];
	var myClientId;
	
	socket.on('connect', function() {
	  socket.on('currentClients', function(data) {
	    clients = data.clients;
	    myClientId = data.clientId;
      $.each(clients, function(client) {
        $('body').append('<div id="'+client[0]+'" style="top: '+client[1]+'; left: '+client[2]+'"></div>');
      });
	  });
	  
  	socket.on('newClient', function(data) {
  	  $('body').append('<div id="'+data.client[0]+'" style="top: '+data.client[1]+'; left: '+data.client[2]+'"></div>');
  	});
	});
  
	$(document).ready(function(){
		$(".sendMsg").click(function(){
			socket.emit('move', { data: 'stuff'} );
		});  
	})
	
})();