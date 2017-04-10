$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	getDepartments();
	
	socket.on("getDepartmentsResponse", function(responses){
		if(responses != undefined){
			responses.forEach(function(item){
				console.log(item);
				var node = document.createElement("li"); // Create a <li> node
				node.innerHTML = "<b>Department name:</b> " + item.Name + " <b>Managed by:</b> " + item.FirstName + " " + item.LastName + " <a href='\/Admin\/viewDepartment.html?id=" + item.DepartmentID + "'>View</a>";
				document.getElementById("departmentList").appendChild(node);
			});
		}
	});
	
	function getDepartments(){
		socket.emit("getDepartments");
	}
});