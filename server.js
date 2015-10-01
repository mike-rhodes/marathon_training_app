var express = require('express');
var mysql = require('mysql');
var path = require('path');
var moment = require('moment');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8888;

/* Instantiate MySQL connection */
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Test123',
	database: 'training_app'
});

/* Connect to the MySQL database */
connection.connect();

/* Application settings */
app.use('/', express.static(__dirname));
app.use(bodyParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Middleware */
function get_weight (req, res, next) {

	/* Call the SQL query which is stored in separate file */
	var weight_sql = fs.readFileSync('middleware/sql/get_weight.sql').toString();

	connection.query(weight_sql, function(err, rows, fields) {
		if (!err) {
			var weight_data = new Object();
			weight_data.title = 'My Weight Data';
		   	weight_data.yAxisTitle = 'Weight (lbs)';
		    weight_data.xAxisTitle = 'Date';
			weight_data.seriesName = 'Daily Weight';
			weight_data.date_only = [];
			weight_data.morning_weight_only = [];
			weight_data.evening_weight_only = [];

			weight_data.morning_weight = [];
			weight_data.evening_weight = [];


			for (var i=0; i < rows.length; i++) {
				date = rows[i].weight_date;
				my_date = new Date(date * 1000);
				my_date_f = moment(my_date).format('L');
				weight_data.date_only.push(my_date_f);

				weight_morning = rows[i].weight_morning;
				weight_data.morning_weight_only.push(weight_morning);

				weight_evening = rows[i].weight_evening;
				weight_data.evening_weight_only.push(weight_evening);

				weight_data.morning_weight.push([my_date_f, weight_morning]);
				weight_data.evening_weight.push([my_date_f, weight_evening]);

			};

			req.weight_data = weight_data;
			return next();

		} else {
			console.log('There was an error');
			return next(err);
		}
	});
}

function get_planned_distance (req, res, next) {
	
	/* Call the SQL query which is stored in separate file */
	var planned_runs_sql = fs.readFileSync('middleware/sql/get_planned_runs.sql').toString();

	connection.query(planned_runs_sql, function (err, rows, fields) {
		if (!err) {
			var run_data = new Object();
			run_data.title = 'My Running Data';
	    	run_data.yAxisTitle = 'Distance (miles)';
	    	run_data.xAxisTitle = 'Date';
			run_data.seriesName = 'Planned Mileage';
			run_data.planned_data = [];
			run_data.dates = [];

			for (var i=0; i < rows.length; i++) {
				date = rows[i].planned_run_date;
				my_date = new Date(date * 1000);
				my_date_f = moment(my_date).format('L');
				run_data.dates.push(my_date_f);
				
				dist = rows[i].planned_run_distance;
				run_data.planned_data.push([my_date_f, dist]);
			};

			req.run_data = run_data;
			return next();

		} else {

			console.log('There was an error');
			return next(err);

		}
	});
}

function get_actual_distance (req, res, next) {
	/* Call the SQL query which is stored in separate file */
	var actual_runs_sql = fs.readFileSync('middleware/sql/get_actual_runs.sql').toString();

	connection.query(actual_runs_sql, function (err, rows, fields) {
		if (!err) {
			var actual_run_data = new Object();
			actual_run_data.title = 'My Running Data';
		   	actual_run_data.yAxisTitle = 'Distance (miles)';
	    	actual_run_data.xAxisTitle = 'Date';
			actual_run_data.seriesName = 'Actual Mileage';
			actual_run_data.actual_data = [];
			actual_run_data.dates = [];
			actual_run_data.duration = [];
			actual_run_data.temp = [];
			actual_run_data.feels_like = [];
			actual_run_data.humidity = [];

			for (var i=0; i < rows.length; i++) {
				date = rows[i].actual_run_date;
				my_date = new Date(date * 1000);
				my_date_f = moment(my_date).format('L');
				actual_run_data.dates.push(my_date_f);
				
				actual_run_data.duration.push(rows[i].total_time);
				actual_run_data.temp.push(rows[i].actual_run_temp);
				actual_run_data.feels_like.push(rows[i].actual_run_feels_like);
				actual_run_data.humidity.push(rows[i].actual_run_humidity);

				dist = rows[i].actual_run_distance;
				actual_run_data.actual_data.push([my_date_f, dist]);
			};

			req.actual_run_data = actual_run_data;
			return next();

		} else {

			console.log('There was an error');
			return next(err);

		}
	});
}

function render_index (req, res) {
	res.render('index.ejs', {
		running_data: req.run_data,
		actual_run_data: req.actual_run_data,
		weight_data: req.weight_data
	});
}

/* Define Routes */
app.get('/', get_weight, get_planned_distance, get_actual_distance, render_index);

app.get('/new_day', function(req, res){
  res.render('new_day.ejs');
});

app.post('/new_day', function(req,res) {
	var weight_date = req.body.weight_date;
	var morning_weight = req.body.morning_weight;
	console.log(weight_date + ' | ' + morning_weight);

	res.redirect('/new_day');
});

app.listen(port);
console.log('Site running on ' + port);
