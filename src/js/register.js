$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	
	$("#submit").click(function() {
		var user = {
			"firstName" : $('#firstName').val(),
			"lastName" : $('#lastName').val(),
			"username" : $('#username').val(),
			"uid" : $('#uid').val(),
			"email" : $('#email').val(),
			"pass" : $('#pass').val(),
			"role" : $('#role').find(":selected").text(),
			"wage" : "1",
			"depId" : "1"
		};
		user = JSON.stringify(user);
		console.log(user);
		socket.emit("register", user);
		window.location.href = '/Admin/AdminIndex.html';
	});
	
	socket.on("registerResponse", function(data){
		console.log(data);
	});
});

