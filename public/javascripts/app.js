(function() {

	var socket = new io.connect('http://localhost:3000');

	socket.on('connect', function() {
		socket.emit('initial', { event: 'initial' });
	});

	socket.on('initial', function (message) {
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
	
	$(document).ready(function(){
		$(".sendMsg").click(function(){
			SocketProxy.sendMessage();
		});  
	})
  
})();