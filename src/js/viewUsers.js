$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	getUsers();
	
	socket.on("getUsersResponse", function(responses){
		if(responses != undefined){
			responses.forEach(function(item){
				console.log(item);
				var node = document.createElement("li"); // Create a <li> node
				node.innerHTML = item.FirstName + " " + item.LastName + " <a href='\/Admin\/viewUser.html?id=" + item.UserID + "'>View</a>";
				document.getElementById("userList").appendChild(node);
			});
		}
	});
	
	function getUsers(){
		console.log('send');
		socket.emit("getUsers");
	}
});