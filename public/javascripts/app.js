(function() {

  var socket = new io.Socket(config.address, {port: config.port, rememberTransport: false});
	//var socket = new io.Socket("http://127.0.0.1/", {port: "3000", rememberTransport: false});

	socket.on('connect', function() {
		socket.send({ event: 'initial' });
	});

	socket.on('message', function (message) {

		switch(message.event) {
			case 'initial':
				console.log(message.data);
			break;
			
			case 'message':
				console.log(message.data);
			break;
		}
	});

	socket.connect();

	var SocketProxy = function() {

		var sendMessage = function(mySessionId) {
			socket.send({
				event: 'message',
				data: {
					boo: "awesome"
				}
			});
		};
		
	}();
	
	console.log(SocketProxy);
	
  $(document).ready(function(){
    $(".sendMsg").click(function(){
      console.log(SocketProxy);
      SocketProxy.sendMessage();
      console.log("test");
    });  
  })
  
})();