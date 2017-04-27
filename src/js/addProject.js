$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	populateDepartments();
	
	$("#submit").click(function() {
		var proj = {
			"name" : $('#name').val(),
			"department" : $('#department').find(":selected").val(),
			"expected" : $('#expected').val()
		};
		proj = JSON.stringify(proj);
		console.log(proj);
		socket.emit("addProject", proj);
		window.location.href = '/Admin/AdminIndex.html';
	});
	
	socket.on("getDepartmentsResponse", function(responses){
		if(responses != undefined){
			responses.forEach(function(item){
				console.log(item);
				var node = document.createElement("option");
				node.text = item.Name;
				node.value = item.DepartmentID;
				document.getElementById("department").options.add(node);
			});
		}
	});
	
	function populateDepartments(){
		socket.emit("getDepartments");
	}
});

