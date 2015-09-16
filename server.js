var express = require('express');
var mysql = require('mysql');
var path = require('path');
var app = express();
var port = process.env.PORT || 8888;

/* Instantiate MySQL connection */
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Test123',
	database: 'training_app'
});

// connection.connect();
// connection.query('SELECT * FROM planned_runs', function(err, rows, fields) {
// 	if (!err) {
// 		console.log('The solution is ', rows);
// 	} else {
// 		console.log('There was an error');
// 	}
// });

// connection.end();

app.use('/', express.static(__dirname));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Define Routes */
app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/new_day', function(req, res){
  res.render('new_day.ejs');
});

app.get('/test', function(req, res){
	connection.connect();
	connection.query('SELECT * FROM planned_runs', function(err, rows, fields) {
	if (!err) {
		res.send(rows);
	} else {
		console.log('There was an error');
	}
});

connection.end();
});

app.listen(port);
console.log('Site running on ' + port);
