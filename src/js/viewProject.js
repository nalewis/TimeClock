$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	
	var a = window.location.toString();
	var id = a.substring(a.indexOf("=")+1);
	console.log(id);
	getProject(id);
	
	socket.on("getProjectResponse", function(response){
		if(response != undefined){
			console.log(response);
			response = response[0];
			document.getElementById("head").innerHTML = response["Name"];
			
			document.getElementById("estimate").textContent = response["ExpectedHours"];
			document.getElementById("due").textContent = response["BillDue"];
			
			//hours spent
			//TODO
			getTotalProjectHours(response["ProjectID"])
			//department info
			getDepartment(response["DepartmentID"]);
		}
	});
	
	socket.on("getDepartmentResponse", function(response){
		if(response != undefined){
			response = JSON.parse(response);
			console.log(response);
			
			document.getElementById("departmentName").textContent = response["department"][0]["Name"];
			
			document.getElementById("manager").textContent = response["department"][0]["FirstName"] + " " + response["department"][0]["LastName"];
		}
	});
	
	function getProject(id){
		socket.emit("getProject", id);
	}
	
	function getDepartment(id){
		socket.emit("getDepartment", id);
	}
});