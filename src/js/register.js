$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log(md5("ready"));
	populateDepartments();
	
	$("#submit").click(function() {
		var user = {
			"firstName" : $('#firstName').val(),
			"lastName" : $('#lastName').val(),
			"username" : $('#username').val(),
			"uid" : $('#uid').val(),
			"email" : $('#email').val(),
			"pass" : md5($('#pass').val()),
			"role" : $('#role').find(":selected").text(),
			"wage" : $('#wage').val(),
			"depId" : $('#department').find(":selected").val()
		};
		user = JSON.stringify(user);
		console.log(user);
		socket.emit("register", user);
		window.location.href = '/Admin/AdminIndex.html';
	});
	
	socket.on("registerResponse", function(data){
		console.log(data);
	});
	
	socket.on("getAllDepartmentsResponse", function(responses){
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
		socket.emit("getAllDepartments");
	}
});

