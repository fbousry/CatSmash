
var mysql = require('mysql');

var fs = require('fs');
var objJSON = JSON.parse(fs.readFileSync('cats.json', 'utf8'));



var mySqlClient = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "admin",
	database : "db"
});

mySqlClient.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");

	for (var i = 0, len = objJSON.images.length; i < len; ++i) {
		var cat = objJSON.images[i];
		console.log(cat.id + ":" + cat.url)
		var sql = "INSERT INTO cat (ExternId, Picture) VALUES ('"+cat.id+"', '"+cat.url+"')";
		mySqlClient.query(sql, function (err, result) {
			if (err) throw err;
			console.log("1 record inserted");
		});
	}	
});