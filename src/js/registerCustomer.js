$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	populateProjects();
	
	$("#submit").click(function() {
		var user = {
			"firstName" : $('#firstName').val(),
			"lastName" : $('#lastName').val(),
			"username" : $('#username').val(),
			"email" : $('#email').val(),
			"pass" : $('#pass').val(),
			"projectId" : $('#project').find(":selected").val()
		};
		user = JSON.stringify(user);
		console.log(user);
		socket.emit("registerCustomer", user);
		window.location.href = '/Admin/AdminIndex.html';
	});
	
	socket.on("registerCustomerResponse", function(data){
		console.log("response: " + data);
	});
	
	socket.on("getProjectsResponse", function(responses){
		if(responses != undefined){
			responses.forEach(function(item){
				console.log(item);
				var node = document.createElement("option");
				node.text = item.Name;
				node.value = item.ProjectID;
				document.getElementById("project").options.add(node);
			});
		}
	});
	
	function populateProjects(){
		socket.emit("getProjects");
	}
});

