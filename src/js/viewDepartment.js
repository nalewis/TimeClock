$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	
	var a = window.location.toString();
	var id = a.substring(a.indexOf("=")+1);
	console.log(id);
	getDepartment(id);
	getDepartmentProjects(id);
	
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
	
	socket.on("getDepartmentProjectsResponse", function(response){
		if(response != undefined){
			console.log(response);
			
			response.forEach(function(item){
				console.log(item);
				var node = document.createElement("li"); // Create a <li> node
				node.innerHTML = item["Name"] + " <a href='/Customer/viewProject.html?id=" + item["ProjectID"] + "'>View</a>";
				document.getElementById("projects").appendChild(node);
			});
		}
	});
	
	function getDepartment(id){
		socket.emit("getDepartment", id);
	}
	
	function getDepartmentProjects(id){
		socket.emit("getDepartmentProjects", id);
	}
});