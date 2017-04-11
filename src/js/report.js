$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	var count = 0;
	
	/*var a = window.location.toString();
	var id = a.substring(a.indexOf("=")+1);
	console.log(id);*/
	getReport();
	
	socket.on("getReportResponse", function(response){
		if(response != undefined){
			response = JSON.parse(response);
			console.log(response);
			//console.log(response["user"][0]);
			response.forEach(function(item){
				var node = document.createElement("span");
				node.textContent = item["FirstName"] + " " + item["LastName"];
				document.getElementById("entries").appendChild(node);
				node = document.createElement("ul");
				node.setAttribute("id", "list" + count);
				document.getElementById("entries").appendChild(node);

				node = document.createElement("li"); // Create a <li> node
				var d = new Date(item["StartTime"]);
				node.innerHTML = d.toDateString() + " <b>Hours: </b>" + item["Hours"];
				document.getElementById("list" + count).appendChild(node);
				count++;
			});

		}
	});
	
	function getReport(){
		socket.emit("getReport");
	}
});