// Sets up the socket server
exports.start = function(socket) {

  socket.on('connection', function(client) {

		client.on('message', function(message) {

			// Parse the incoming event
			switch (message.event) {
			
				// User initialization
				case 'initial':
				  var data = {
					testing: "cool"
				  };

				  // Send initialization data back to the client
				  client.send({
					event: 'initial',
					data: data
				  });
				break;

				// User sent a message
				case 'message':
				  var data = {
					success: true
				  };

				  // Send confirmation data back to the client
				  client.send({
					event: 'message',
					data: data
				  });
				break;
				
			}
		  
		});
	});
	
};