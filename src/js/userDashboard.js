$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	
	var a = window.location.toString();
	var id = a.substring(a.indexOf("=")+1);
	console.log(id);
	getUser(id);
	
	socket.on("getUserResponse", function(response){
		if(response != undefined){
			response = JSON.parse(response);
			console.log(response["user"][0]);
			console.log(response["user"][0]["FirstName"]);
			document.getElementById("head").innerHTML = response["user"][0]["FirstName"] + " " + response["user"][0]["LastName"];
			
			document.getElementById("username").textContent = response["user"][0]["Username"];
			document.getElementById("wage").textContent = response["user"][0]["Wage"];
			document.getElementById("email").textContent = response["user"][0]["Email"];
			document.getElementById("department").textContent = response["user"][0]["Name"];
			if(response["user"][0]["isAdmin"]){
				document.getElementById("admin").textContent = "Yes";
			} else {
				document.getElementById("admin").textContent = "No";
			}
			
			getDepartmentProjects(response["user"][0]["DepartmentID"]);
			
			response["timeEntries"].forEach(function(item){
				console.log(item);
				var node = document.createElement("li"); // Create a <li> node
				var d = new Date(item["StartTime"]);
				console.log(d);
				if(item["ProjectID"] == undefined){
					node.innerHTML = d.toDateString() + " <b>Hours: </b>" + item["Hours"] + " <button>Assign</button>";
					node.value = item["ID"]
					node.addEventListener("click", assignTime(node.value));
				} else {
					//node.innerHTML = d.toDateString() + " <b>Hours: </b>" + item["Hours"] + " " + item[";
				}
				
				document.getElementById("timeEntries").appendChild(node);
			});
		}
	});
	
	socket.on("getDepartmentProjectsResponse", function(response){
		if(response != undefined){
			response.forEach(function(item){
				console.log(item);
				var node = document.createElement("option");
				node.text = item.Name;
				node.value = item.ProjectID;
				document.getElementById("projects").options.add(node);
			});
		}
	})
	
	function getUser(id){
		socket.emit("getUser", id);
	}
	
	function getDepartmentProjects(id){
		socket.emit("getDepartmentProjects", id);
	}
	
	function assignTime(id){
		console.log(id);
	}
});