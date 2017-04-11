$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	reloadClockedIn();
	
	document.getElementById("clock").focus();
	$("#clock").change(function() {
		socket.emit("clockTime", $("#clock").val());
	});
	
	socket.on("clockTimeResponse", function(data){
		console.log(data);
		reloadClockedIn();
		location.reload();
	});
	
	socket.on("getClockedInResponse", function(responses){
		var text = "";
		if(responses != undefined){
			console.log("response: " + responses);
			for(i = 0; i < responses.length; i++){
				text+="<span>" + responses[i].StartTime + " " + responses[i].FirstName + "</span><br>";
			}
			document.getElementById("clockedIn").innerHTML = text;
		}
	});
	
	function reloadClockedIn(){
		socket.emit("getClockedIn");
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
	if(readCookie("user") == null ){
		$("#navbar.navbar-collapse li:not(.default)").hide();
	}
	
});

