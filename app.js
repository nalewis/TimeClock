// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var mysql = require('mysql');
var path = require('path');

var connection = mysql.createConnection(
    {
        host: 'us-cdbr-azure-east-c.cloudapp.net',
        user: 'b2291f79d4737a',
        password: '8569c35a',
        database: 'timeclock2',
    }
);

connection.connect();
console.log("database connected");

// view engine setup
app.use(express.static(path.join(__dirname, 'src'))); 

app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res) {  
    res.send('/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
	
    socket.on('clockTime', function(id){
		console.log(id);
		clocktime(id);
		socket.emit('clockTimeResponse', id);
	});
	socket.on('getClockedIn', function(){
		var callback = function(resp){
			console.log("Get Test !!!! " + resp);
			socket.emit('getClockedInResponse', resp);
		}
		getClockedIn(callback);
	});
		
    socket.on('login', function (email, password) {
        if(isCustomer){
			socket.emit('loginResponse','Customer');
		}
		else if(isManager){
			socket.emit('loginResponse','Manager');
		}
		else if(isEmployee){
			socket.emit('loginResponse','Employee');
		}
		else{
			socket.emit('loginResponse','Invalid username/password');
		}
    });
});

server.listen(4000, function(){
	console.log('listening on *:4000');
});

io.listen(5000);
console.log("Web sockets readied");


//Database Classes
var Employee = function (FirstName, LastName, UserID, Wage, DepartmentID, Email, TimeEntries){
	this.FirstName = FirstName;
	this.LastName = LastName;
	this.UserID = UserID;
	this.Wage = Wage;
	this.DepartmentID = DepartmentID;
	this.Email = Email;
	this.TimeEntries = TimeEntries;
}
var Customer = function (Name, CustomerID, Email, Wage, DepartmentID, Email, Projects){
	this.Name = Name;
	this.CustomerID = CustomerID;
	this.Email = Email;
	this.Projects = Projects;
}
var Project = function (Name, ProjectID, DepartmentID, CustomerID, ExpectedHours, BillDue, BillTotal){
	this.Name = Name;
	this.ProjectID = ProjectID;
	this.DepartmentID = DepartmentID;
	this.CustomerID = CustomerID;
	this.ExpectedHours = ExpectedHours;
	this.BillDue = BillDue;
	this.BillTotal = BillTotal;
}
var Department = function (Name, DepartmentID, ManagerID, Projects, Employees){
	this.Name = Name;
	this.DepartmentID = DepartmentID;
	this.ManagerID = ManagerID;
	this.Projects = Projects;
	this.Employees = Employees;
}
var TimeEntry = function (Name, CustomerID, Email, Wage, DepartmentID, Email, Projects){
	this.Name = Name;
	this.CustomerID = CustomerID;
	this.Email = Email;
	this.Projects = Projects;
}
//Login class Identifier
function isCustomer(email,password){
	var sql = "SELECT * FROM Customers WHERE Email = '"+mysql.escape(email)+"' AND Password = '"+mysql.escape(password)+"';";
        connection.query(sql, function (err, result) {
            if (err)
                console.log("isCustomer select Customers SQL ERROR: " + err + ": " + sql);
            else {
                return rows[0] != undefined;
            }
        });
}
function isEmployee(email,password){
	var sql = "SELECT * FROM Employees WHERE Email = '"+mysql.escape(email)+"' AND Password = '"+mysql.escape(password)+"';";
        connection.query(sql, function (err, result) {
            if (err)
                console.log("isEmployee select Employees SQL ERROR: " + err + ": " + sql);
            else {
                return rows[0] != undefined;
            }
        })
}
function isManager(email,password){
	var sql = "SELECT * FROM Employees WHERE Email = '"+mysql.escape(email)+"' AND Password = '"+mysql.escape(password)+" AND (SELECT * FROM Departments WHERE ManagerID = Employees.userID;";
        connection.query(sql, function (err, result) {
            if (err)
                console.log("isManager select Employees, Departments SQL ERROR: " + err + ": " + sql);
            else {
                return rows[0] != undefined;
            }
        })
}
//PostObject Methods
function clocktime(pastId){
	var userId = mysql.escape(pastId);
	if(userId != ""){
		var check = "select * from TimeEntries where EndTime is NULL and UserID = " + userId;
		console.log(check);
		connection.query(check, function (err, result) {
			if(err){
				console.log("clockTime select time entry" + err + check);
				
			} else {
				console.log(result);
				if(result[0] != undefined){
					console.log("Existing entry");
					check = "update TimeEntries set EndTime=sysdate(), hours=round(timestampdiff(minute, StartTime, EndTime)/60, 1) where UserID = " + userId + " and EndTime is NULL";
				} else {
					console.log("New entry");
					check = "insert into TimeEntries (UserID, StartTime) values (" + userId + ",sysdate())";
				}
				connection.query(check, function (err, result) {
					if(err){
						console.log("clocktime phase 2" + err + check);
					}
				});
			}
		});
	}
}

function getClockedIn(callback){
	var sql = "Select e.FirstName, t.StartTime from Employees e, TimeEntries t where e.UserID = t.UserID and t.EndTime is null";
	connection.query(sql, function (err, result) {
		if(err){
			console.log("get clocked in;" + err + sql);
		} else {
			console.log("getClockedin result: " + result);
			if(callback){
				callback(result);
			}
		}
	});
}