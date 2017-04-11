$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	populateManagers();
	
	$("#submit").click(function() {
		var depo = {
			"name" : $('#name').val(),
			"manager" : $('#manager').find(":selected").val()
		};
		depo = JSON.stringify(depo);
		console.log(depo);
		socket.emit("addDepartment", depo);
		window.location.href = '/Admin/AdminIndex.html';
	});
	
	socket.on("adminDepartmentResponse", function(data){
		console.log(data);
	});
	
	function populateManagers(){
		socket.emit("getUsers");
	}
	
	socket.on("getUsersResponse", function(responses){
		if(responses != undefined){
			responses.forEach(function(item){
				console.log(item);
				var node = document.createElement("option");
				node.text = item.FirstName + " " + item.LastName;
				node.value = item.UserID;
				document.getElementById("manager").options.add(node);
			});
		}
	});
});

