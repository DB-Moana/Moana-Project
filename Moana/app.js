// The Olympics For Everyone

var mysql = require('mysql'); // MySQL module on node.js

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '1234',
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

app.post('/search-result', function (req, res) {
	console.log(req.body); // log to the node.js server
	
	queryStr = "SELECT P_Name, Phone_Num, Sport, Country FROM player WHERE P_Name LIKE '%"+
				req.body.player + "%';";

	console.log("Retrieve query: " + queryStr); // you may check the queryStr

	connection.query(queryStr, function (err, rows, fields) { // send query to MySQL
		if (err)
			throw err;
		console.log(rows); // log to check MySQL SELECT result
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		var context = {
				title: 'Result', 
				info: rows
			};
		
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
	})
});

app.get('/about', function (req, res) {
	res.sendFile(__dirname + "/about.html");
});

app.get('/contact', function (req, res) {
	res.sendFile(__dirname + "/contact.html");
});
