$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	
	function createCookie(name,value,days) {
	    var expires = "";
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + value + expires + "; path=/";
	}

	function readCookie(name) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}

	$("#login").click(function(e) {
		e.preventDefault();
		var user = {
			"email" : $('#email').val(),
			"pass" : $('#password').val()
		};
		user = JSON.stringify(user);
		console.log(user);
		socket.emit("login", user);
		createCookie("user",user, 1);
		window.location.href = '/Admin/AdminIndex.html';
	});
	
	socket.on("loginResponse", function(data){
		console.log(data);
	});
});

