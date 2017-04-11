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
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use('/js', express.static(__dirname + '/src/js')); // redirect JS local
app.use('/css', express.static(__dirname + '/src/css')); // redirect CSS local

app.get('/', function(req, res) {  
    res.send('/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
	
    socket.on('clockTime', function(id){
		console.log(id);
		var callback = function(){
			socket.emit('clockTimeResponse');
		}
		clocktime(callback, id);
		
		socket.emit('clockTimeResponse', id);
	});
	socket.on('getClockedIn', function(){
		var callback = function(resp){
			socket.emit('getClockedInResponse', resp);
		}
		getClockedIn(callback);
	});
		
	socket.on('register', function(user){
		var callback = function(resp){
			socket.emit('registerResponse', resp);
		}
		registerUser(callback, user);
	});
	
	socket.on('getUsers', function(){
		var callback = function(resp){
			socket.emit('getUsersResponse', resp);
		}
		getUsers(callback);
	});
	
	socket.on('getUser', function(id){
		var callback = function(resp){
			socket.emit('getUserResponse', resp);
		}
		getUser(callback, id);
	});
	
	socket.on('addDepartment', function(depo){
		var callback = function(resp){
			socket.emit('addDepartmentResponse', resp);
		}
		addDepartment(callback, depo);
	});
	
	socket.on('getDepartments', function(){
		var callback = function(resp){
			socket.emit('getDepartmentsResponse', resp);
		}
		getDepartments(callback);
	});
	
	socket.on('getDepartment', function(id){
		var callback = function(resp){
			socket.emit('getDepartmentResponse', resp);
		}
		getDepartment(callback, id);
	});
	
	socket.on('getReport', function(){
		var callback = function(resp){
			socket.emit('getReportResponse', resp);
		}
		getReportData(callback);
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
function clocktime(callback, pastId){
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
					/*var d1 = new Date(result[0]["EndTime"]);
					var d2 = new Date(result[0]["StartTime"]);
					var diff = d1-d2;
					console.log(d1 + " " + diff);
					check = "update TimeEntries set EndTime=sysdate(), Hours=" + diff + ", where UserID = " + userId + " and EndTime is NULL";*/
					check = "update TimeEntries set EndTime=sysdate(), Hours=timestampdiff(minute, StartTime, EndTime)/60 where UserID = " + userId + " and EndTime is NULL";
					console.log(check);
				} else {
					console.log("New entry");
					check = "insert into TimeEntries (UserID, StartTime) values (" + userId + ",sysdate())";
				}
				connection.query(check, function (err, result) {
					if(err){
						console.log("clocktime phase 2: " + err + check);
					} else {
						callback();
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

function registerUser(callback, user){
	user = JSON.parse(user);
	console.log(user);
	var isAdmin = false;
	if(user["role"] == "Admin"){
		isAdmin = true;
	}
	var sql = "Insert into Employees (FirstName, LastName, UserID, Email, Wage, DepartmentID, Username, Password, IsAdmin) VALUES ('"
	+ user["firstName"] + "', '" + user["lastName"] + "', " + user["uid"] + ", '" + user["email"] + "', " + user["wage"] + ", " + user["depId"]
	+ ", '" + user["username"] + "', '" + user["pass"] + "', " + isAdmin + ")";
	connection.query(sql, function (err, result) {
		if(err){
			console.log("Register user error; " + err + sql);
		} else {
			console.log("Register user result: " + result);
			if(callback){
				callback(result);
			}
		}
	});
}

function getUsers(callback){
	var check = "select * from Employees";
	connection.query(check, function (err, result) {
		if(err){
			console.log("Get Users error: " + err + check);
		} else {
			console.log(result);
			callback(result);
		}
	});
}

function getUser(callback, id){
	var sql = "Select * from Employees inner join Departments on Employees.DepartmentID = Departments.DepartmentID where UserID = " + id;
	var userInfo = {
		"user" : [],
		"timeEntries" : []
	};
	connection.query(sql, function (err, result) {
		if(err){
			console.log("Get user error: " + err + sql);
		} else {
			console.log("Get User Result: " + result);
			userInfo["user"] = result;
			
			sql = "select * from TimeEntries where EndTime is not NULL and UserID = " + id;
	
			connection.query(sql, function (err, result) {
				if(err){
					console.log("Get user error: " + err + sql);
				} else {
					console.log("Get User Result: " + result);
					userInfo["timeEntries"] = result;

					callback(JSON.stringify(userInfo));
				}
			});
		}
	});
}

function addDepartment(callback, depo){
	depo = JSON.parse(depo);
	console.log(depo);

	var sql = "Insert into Departments (Name, ManagerID) VALUES ('" + depo["name"] + "', " + depo["manager"] + ")";
	connection.query(sql, function (err, result) {
		if(err){
			console.log("Add department error; " + err + sql);
		} else {
			console.log("Add department result: " + result);
			callback(result);
		}
	});
}

function getDepartments(callback){
	var check = "select Departments.Name, Departments.DepartmentID, Employees.FirstName, Employees.LastName, Employees.UserID from Departments inner join Employees on Departments.ManagerID = Employees.UserID";
	connection.query(check, function (err, result) {
		if(err){
			console.log("Get Departments error: " + err + check);
		} else {
			console.log(result);
			callback(result);
		}
	});
}

function getDepartment(callback, id){
	var sql = "Select * from Departments inner join Employees on Departments.ManagerID = Employees.UserID where Departments.DepartmentID = " + id;
	var departmentInfo = {
		"department" : [],
		"employees" : []
	};
	connection.query(sql, function (err, result) {
		if(err){
			console.log("Get department error: " + err + sql);
		} else {
			console.log("Get Department Result: " + result);
			departmentInfo["department"] = result;
			
			sql = "select * from Employees where DepartmentID = " + id;
	
			connection.query(sql, function (err, result) {
				if(err){
					console.log("Get employees error: " + err + sql);
				} else {
					console.log("Get employees result: " + result);
					departmentInfo["employees"] = result;

					callback(JSON.stringify(departmentInfo));
				}
			});
		}
	});
}

function getReportData(callback){
	var check = "select Employees.FirstName, Employees.LastName, TimeEntries.Hours, TimeEntries.StartTime, TimeEntries.EndTime from TimeEntries, Employees where EndTime is not NULL and Employees.UserID = TimeEntries.UserID order by StartTime";
				
	connection.query(check, function (err, result) {
		if(err){
			console.log("Get user error: " + err + check);
		} else {
			console.log("Get User Result: " + result);
			callback(JSON.stringify(result));
		}
	});	
}