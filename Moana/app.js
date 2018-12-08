// The Olympics For Everyone

var mysql = require('mysql'); // MySQL module on node.js

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'moana2016',
    database : 'mydb',
});

connection.connect(); // Connection to MySQL

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use('/', express.static(__dirname + '/public')); // you may put public js, css, html files if you want...
app.set('view engine', 'ejs');      //view engine - to render the result
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// "node app.js" running on port 3000
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

// base url action: "http://localhost/" -> send "index.html" file.
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});


/* SEARCH */

app.get('/search', function (req, res) {
	res.sendFile(__dirname + "/search.html");
});

/* SEARCH-RESULT */
/* post action from searcb.html: '<form action="/search" method="POST">' brought here
 * send 'context', which includes the result of query, to search-result.ejs
 */

/*app.get('/search-result', function (req, res) {
	res.sendFile(__dirname + "/search-result.html");
});*/

var player_data;
var event_key_data=[];

app.post('/search-result', function (req, res) {
	//
	event_data = [];
	console.log(req.body); // log to the node.js server
	
	

	var searchtag = 0;
	if(req.body.player != '')
	{
		searchtag = 1;
		if(req.body.date !='')
		{
			searchtag = 5;
		}
	}
	else if(req.body.date !='')
	{
		searchtag = 2;
		if(req.body.country !='')
		{
			searchtag = 6;
		}
		else if(req.body.sports !='')
		{
			searchtag = 7;
		}
	}
	else if(req.body.country !='')
	{
		searchtag = 3;
		if(req.body.sports !=''){
			searchtag = 8;
		}
	}
	else if(req.body.sports !='')
	{
		searchtag = 4;
	}
	if(searchtag == 0)
	{
		var context = {
			title: 'Result', 
			info: null,
			player: null,
			country: null,
			noresult : 1,
			if_player: 0,
			if_country: 0

		};
					  	console.log(context);
						req.app.render('search-result', context, function(err, html) {
				            if (err) {
				                console.error('error during response : ' + err.stack);

					               res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					               res.write('<h2>error</h2>');
					               res.write('<p>' + err.stack + '</p>');
					               res.end();
					                return;
					            }
				            
								res.end(html);
					
							});
	}
	if(searchtag == 1 || searchtag == 5) //Player, Player + Date
	{
		queryStr1 = "SELECT P_Name, Age, Height, Weight, Sport, Country FROM player WHERE P_Name LIKE '%"+
					req.body.player + "%';";
		queryStr2 = "CREATE VIEW Found_event AS SELECT PLAYER_EVENT.E_Type, PLAYER_EVENT.S_Name FROM PLAYER_EVENT WHERE PLAYER_EVENT.Player = '"+req.body.player+"';";

		console.log("Retrieve query: " + queryStr1); // you may check the queryStr

		//get player data
		connection.query(queryStr1, function (err, rows, fields) { // send query to MySQL
			if (err)
				throw err;
			console.log(rows); // log to check MySQL SELECT result
			//res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			


			//get event data
			connection.query(queryStr2, function (err,  fields) { // send query to MySQL
				if (err)
					throw err;
					queryStrb = "CREATE VIEW event_building AS SELECT EVENT.Date, EVENT.TIME, EVENT.E_type, EVENT.S_Name, EVENT.Place, Place.B_Name FROM Found_event, EVENT, Place WHERE Found_event.E_type = EVENT.E_Type AND Found_event.S_Name = EVENT.S_Name AND EVENT.Place = Place.B_Code ORDER BY EVENT.Date;";
					connection.query(queryStrb);
					if(searchtag == 1){
						queryStr3 ="SELECT * FROM event_building;";
					}
					else{
						queryStr3 ="SELECT * FROM event_building WHERE event_building.Date ='" + req.body.date+"';";
					}
					
					console.log(queryStr3);
					
					connection.query(queryStr3, function (err, rows2, fields) { // send query to MySQL
						if (err)
							throw err;
						console.log(rows2); // log to check MySQL SELECT result
						var context = {
							title: 'Result', 
							info: rows2,
							player: rows,
							country: null,
							noresult : 0,
							if_player: 1,
							if_country: 0

							
						};
						if(rows2.length == 0 || rows.length == 0)
						{
							context.noresult = 1;
						}
						
					  	console.log(context);
						req.app.render('search-result', context, function(err, html) {
				            if (err) {
				                console.error('error during response : ' + err.stack);

					               res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					               res.write('<h2>error</h2>');
					               res.write('<p>' + err.stack + '</p>');
					               res.end();
					                return;
					            }
				            
								res.end(html);
					
							});
						
					});
			connection.query("Drop view found_event");
			connection.query("Drop view event_building");
					
				

				});
			});
	}

	if(searchtag == 2) //Date
	{	
		queryStrb = "CREATE VIEW event_building AS SELECT EVENT.Date, EVENT.TIME, EVENT.E_type, EVENT.S_Name, EVENT.Place, Place.B_Name FROM EVENT, Place WHERE EVENT.Date ='" + req.body.date+"' AND EVENT.Place = Place.B_Code ORDER BY EVENT.Date;";
		connection.query(queryStrb);		
		queryStr =  "SELECT * FROM event_building;"
		connection.query(queryStr, function (err, rows, fields) { // send query to MySQL
			if (err)
				throw err;
			console.log(rows); // log to check MySQL SELECT result
						
			var context = {
				title: 'Result', 
				info: rows,
				player: null,
				country: null,
				noresult : 0,
				if_player: 0,
				if_country: 0
			};
			if(rows.length == 0)
			{
				context.noresult = 1;
			}
			console.log(context);
			req.app.render('search-result', context, function(err, html) {
				if (err) {
				    console.error('error during response : ' + err.stack);
				    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					res.write('<h2>error</h2>');
					res.write('<p>' + err.stack + '</p>');
					res.end();
					return;
				}
				res.end(html);
			});
						
		});
		connection.query("Drop view event_building");
	}
	if(searchtag == 3 || searchtag == 6 || searchtag == 8) //Country, Date+Country, Sports + Country
	{
		var cou = req.body.country;
		queryStr = "CREATE VIEW Found_player AS SELECT PLAYER.P_Name FROM PLAYER WHERE PLAYER.Country = '"+cou+"';";
		console.log(queryStr);
		connection.query(queryStr); // send query to MySQL
		queryStr1 = "CREATE VIEW Found_Event AS SELECT PLAYER_EVENT.E_Type, PLAYER_EVENT.S_Name FROM PLAYER_EVENT, Found_player WHERE PLAYER_EVENT.Player = Found_player.P_Name;";
		console.log(queryStr1);
		connection.query(queryStr1)
		queryStrb1 = "CREATE VIEW event_building AS SELECT EVENT.Date, EVENT.TIME, EVENT.E_type, EVENT.S_Name, EVENT.Place, Place.B_Name FROM Found_Event, EVENT, Place WHERE Found_Event.E_type = EVENT.E_Type AND Found_Event.S_Name = EVENT.S_Name AND EVENT.Place = Place.B_Code ORDER BY EVENT.Date;";
		connection.query(queryStrb1);
		console.log(queryStrb1);
		/*connection.query("SELECT * FROM event_building1", function (err, rows, fields) { 
			console.log(rows);
		});
		//queryStrb2 = "CREATE VIEW event_building AS SELECT * FROM event_building1 GROUP BY event_building1.E_type;"
		console.log(queryStrb2);
		connection.query(queryStrb2);*/
		if(searchtag == 3)
		{
			queryStr2 ="SELECT DISTINCT * FROM event_building ORDER BY event_building.Date;";
		}
		else if(searchtag == 6)
		{
			queryStr2 ="SELECT DISTINCT * FROM event_building WHERE event_building.Date ='"+req.body.date+"' ORDER BY event_building.Date;";
		}
		else{
			queryStr2 ="SELECT DISTINCT * FROM event_building WHERE event_building.S_Name ='"+req.body.sports+"' ORDER BY event_building.Date;";
		}
		console.log(queryStr2);
		connection.query(queryStr2, function (err, rows, fields) { // send query to MySQL
			queryStr3 = "SELECT N_O_P, C_Code, Continent, C_Name FROM Country WHERE C_Code LIKE '%"+
					cou + "%';";
			console.log(queryStr3);
			connection.query(queryStr3, function (err, rows1, fields) { 
				if (err)
					throw err;
				console.log(rows); // log to check MySQL SELECT result
				console.log(rows1)
						
					var context = {
						title: 'Result', 
						info: rows,
						player: null,
						country: rows1,
						noresult : 0,
						if_player: 0,
						if_country: 1
					};
					if(rows.length == 0)
						{
							context.noresult = 1;
						}
					console.log(context);
					req.app.render('search-result', context, function(err, html) {
						if (err) {
						    console.error('error during response : ' + err.stack);
						    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
							res.write('<h2>error</h2>');
							res.write('<p>' + err.stack + '</p>');
							res.end();
							return;
						}
						res.end(html);
					});
				});
						
				});	
		
		connection.query("Drop view Found_player");
		connection.query("Drop view Found_Event");
		connection.query("Drop view event_building");
		//connection.query("Drop view event_building1");
	}
	if(searchtag == 4) //Sports
	{
		queryStrb = "CREATE VIEW event_building AS SELECT EVENT.Date, EVENT.TIME, EVENT.E_type, EVENT.S_Name, EVENT.Place, Place.B_Name FROM EVENT, Place WHERE EVENT.S_Name ='" + req.body.sports+"' AND EVENT.Place = Place.B_Code ORDER BY EVENT.Date;";
		connection.query(queryStrb);

		queryStr = "SELECT * FROM event_building ORDER BY event_building.Date;"
		console.log(queryStr);
		connection.query(queryStr, function (err, rows, fields) { // send query to MySQL
				if (err)
					throw err;
				console.log(rows); // log to check MySQL SELECT result
						
					var context = {
						title: 'Result', 
						info: rows,
						player: null,
						country: null,
						noresult : 0,
						if_player: 0,
						if_country: 0
					};
					if(rows.length == 0)
					{
						context.noresult = 1;
					}
					console.log(context);
					req.app.render('search-result', context, function(err, html) {
						if (err) {
						    console.error('error during response : ' + err.stack);
						    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
							res.write('<h2>error</h2>');
							res.write('<p>' + err.stack + '</p>');
							res.end();
							return;
						}
						res.end(html);
					});
						
				});
			connection.query("Drop view event_building");	
	}
	
	if(searchtag == 7) // Date+ Sports
	{
		queryStrb = "CREATE VIEW event_building AS SELECT EVENT.Date, EVENT.TIME, EVENT.E_type, EVENT.S_Name, EVENT.Place, Place.B_Name FROM EVENT, Place WHERE EVENT.S_Name ='" + req.body.sports+"'AND EVENT.Date ='" + req.body.date+"' AND EVENT.Place = Place.B_Code ORDER BY EVENT.Date;";
		connection.query(queryStrb);
		queryStr = "SELECT * FROM event_building;"
		console.log(queryStr);
		connection.query(queryStr, function (err, rows, fields) { // send query to MySQL
				if (err)
					throw err;
				console.log(rows); // log to check MySQL SELECT result
						
					var context = {
						title: 'Result', 
						info: rows,
						player: null,
						country: null,
						noresult : 0,
						if_player: 0,
						if_country: 0
					};
					if(rows.length == 0)
					{
						context.noresult = 1;
					}
					console.log(context);
					req.app.render('search-result', context, function(err, html) {
						if (err) {
						    console.error('error during response : ' + err.stack);
						    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
							res.write('<h2>error</h2>');
							res.write('<p>' + err.stack + '</p>');
							res.end();
							return;
						}
						res.end(html);
					});
						
				});	
		connection.query("Drop view event_building");
	}
	req.body = {};

	
	
	
});

app.get('/about', function (req, res) {
	res.sendFile(__dirname + "/about.html");
});

app.get('/contact', function (req, res) {
	res.sendFile(__dirname + "/contact.html");
});
