$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	
	var a = window.location.toString();
	var id = a.substring(a.indexOf("=")+1);
	console.log(id);
	getUser(id);
	
	socket.on("getUserResponse", function(response){
		if(response != undefined){
			response = JSON.parse(response);
			console.log(response["user"][0]);
			document.getElementById("head").innerHTML = response["user"][0]["FirstName"] + " " + response["user"][0]["LastName"];
			
			//$("#userInfo").innerHTML = ""
			
			response["timeEntries"].forEach(function(item){
				console.log(item);
				var node = document.createElement("li"); // Create a <li> node
				var d = new Date(item["StartTime"]);
				console.log(d);
				node.innerHTML = d.toDateString() + " <b>Hours: </b>" + item["Hours"];
				document.getElementById("timeEntries").appendChild(node);
			});
		}
	});
	
	function getUser(id){
		socket.emit("getUser", id);
	}
});