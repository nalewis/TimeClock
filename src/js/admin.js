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
	
	$("#viewDepartments").click(function() {
		window.location.href = '/Admin/viewDepartments.html';
	});
	
	$("#registerCustomer").click(function() {
		window.location.href = '/Admin/registerCustomer.html';
	});
	
	$("#addProject").click(function() {
		window.location.href = '/Admin/addProject.html';
	});
});