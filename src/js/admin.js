$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");

	$("#report").click(function() {
		window.location.href = '/Admin/report.html';
	});
	
	$("#register").click(function() {
		window.location.href = '/Admin/register.html';
	});
	
	$("#viewUsers").click(function() {
		window.location.href = '/Admin/viewUsers.html';
	});
	
	$("#addDepartment").click(function() {
		window.location.href = '/Admin/addDepartment.html';
	});
	
	$("#viewDepartment").click(function() {
		window.location.href = '/Admin/viewDepartment.html';
	});
});