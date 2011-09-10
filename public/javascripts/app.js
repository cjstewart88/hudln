(function() {

  var socket = new io.connect('http://localhost:3000');
	//var socket = new io.Socket("http://127.0.0.1/", {port: "3000", rememberTransport: false});

	socket.on('connect', function() {
		socket.emit('initial', { event: 'initial' });
	});

	socket.on('initial', function (message) {
    console.log(message);
		switch(message.event) {
			case 'initial':
				console.log(message.data);
			break;
			
			case 'message':
				console.log(message.data);
			break;
		}
	});

	var SocketProxy = function(){}
	SocketProxy.sendMessage = function(mySessionId) {
			socket.send({
				event: 'message',
				data: {
					boo: "awesome"
				}
			});
		};

	console.log(SocketProxy);
	
  $(document).ready(function(){
    $(".sendMsg").click(function(){
      console.log(SocketProxy);
      SocketProxy.sendMessage();
      console.log("test");
    });  
  })
  
})();