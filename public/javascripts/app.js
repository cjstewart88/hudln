(function() {

	//var socket = new io.connect('http://localhost:3000');
	var socket = io.connect('http://127.0.0.1:8080');
  //var socket = new io.Socket(null, {rememberTransport: false, port: 8080});
	
	socket.on('connect', function() {
		socket.emit('message', { event: 'initial', message: 'boo!' });
		socket.on('message', function (newMessage) {
  	  alert('');
  	  $('body').append(newMessage)
  	});
	});
  
	$(document).ready(function(){
		$(".sendMsg").click(function(){
			socket.send('message', { data: 'stuff'} );
		});  
	})
})();