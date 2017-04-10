$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	
	var a = window.location.toString();
	var id = a.substring(a.indexOf("=")+1);
	console.log(id);
	getDepartment(id);
	
	socket.on("getDepartmentResponse", function(response){
		if(response != undefined){
			response = JSON.parse(response);
			console.log(response);
			
			document.getElementById("head").innerHTML = response["department"][0]["Name"];
			
			document.getElementById("manager").textContent = response["department"][0]["FirstName"] + " " + response["department"][0]["LastName"];
			
			response["employees"].forEach(function(item){
				console.log(item);
				var node = document.createElement("li"); // Create a <li> node
				node.innerHTML = item["FirstName"] + " " + item["LastName"];
				document.getElementById("employees").appendChild(node);
			});
		}
	});
	
	function getDepartment(id){
		socket.emit("getDepartment", id);
	}
});