$(document).ready(function() {
	var socket = io();
	console.log(socket);
	console.log("ready");
	var count = 0;
	
	getReport();
	var report;
	
	socket.on("getReportResponse", function(response){
		if(response != undefined){
			report = response;
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
	
	$("#download").click(function(){
		DownloadJSON2CSV(report);
	});
	
	function DownloadJSON2CSV(objArray)
    {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		
        var str = 'First Name,Last Name,Hours,Start Time,End Time,\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';

            for (var index in array[i]) {
                line += array[i][index] + ',';
            }

            line.slice(0,line.Length-1); 

            str += line + '\r\n';
        }
		
		var downloadLink = document.createElement("a");
		var blob = new Blob(["\ufeff", str]);
		var url = URL.createObjectURL(blob);
		downloadLink.href = url;
		downloadLink.download = "report.csv";
		
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
    }
	
	function getReport(){
		socket.emit("getReport");
	}
});