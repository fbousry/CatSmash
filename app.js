var express = require('express');

var app = express();
var mysql = require('mysql');
var Cat = require('./cat.js');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

var mySqlClient = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "admin",
	database : "db"
});

app.use(bodyParser.urlencoded({ extended: true })); 
//routes
app.get('/', function(req, res) {
	var queryString = 'SELECT Id, Picture FROM cat ORDER BY RAND() LIMIT 2';

	mySqlClient.query(queryString, function(err, rows, fields) {
		if (err) throw err;

		res.render('home.ejs', { cats : rows});
	});

})
	.get('/all-cats', function(req, res) {
	var queryString = 'SELECT Id, Picture FROM cat ORDER BY VotePercent DESC';

	mySqlClient.query(queryString, function(err, rows, fields) {
		if (err) throw err;
		res.render('list-cats.ejs', { cats : rows});
	});

})

.get('/vote2', function(req, res) {
		
	var notselectCatId = req.query.ids[0] == req.query.selectedCat? req.query.ids[1] : req.query.ids[0]; 
	
	var vote = 0;
	var totalVote = 0;
	var percent = 0.00;
	
	var queryString = 'SELECT Vote, TotalVote FROM cat where id = ' + req.query.selectedCat;
	mySqlClient.query(queryString, function(err, rows, fields) {
		if (err) throw err;

		vote = parseInt(rows[0].Vote);
		totalVote = parseInt(rows[0].TotalVote);
		
	});	
	
	vote = vote + 1;
	totalVote = totalVote + 1;
	percent = ((vote) / (totalVote)) * 100;
	
	queryString ="UPDATE cat SET Vote = "+ (vote) +", TotalVote = " + (totalVote) +", VotePercent = "+ percent +" where id = " + req.query.selectedCat;
	
	console.log('req1'+queryString);
	
	mySqlClient.query(queryString, function(err, fields) {
		if (err) throw err;
	});
	
	vote = 0;
	totalVote = 0;
	percent = 0.00;
	
	var queryString = 'SELECT Vote, TotalVote FROM cat where id = ' + notselectCatId;
	mySqlClient.query(queryString, function(err, rows, fields) {
		if (err) throw err;
		vote = parseInt(rows[0].Vote);
		totalVote = parseInt(rows[0].TotalVote);
		
	});
	
	totalVote = totalVote + 1;
	percent = (vote / (totalVote)) * 100;	
	
	
	queryString ="UPDATE cat SET TotalVote = " + (totalVote) + ", VotePercent = "+ percent +" where id = "+notselectCatId;
	console.log('req2'+queryString);
	mySqlClient.query(queryString, function(err, fields) {
		if (err) throw err;
	});
	
	res.redirect('/');
})

.post('/vote', function(req, res) {
    console.log(req.body.selectedCat);
	// console.log(req.body.ids[0]);
	res.redirect('/');
});

app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(400.).send('Page introuvable !');
});

app.listen(8080);