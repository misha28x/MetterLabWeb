const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = mysql.createConnection({
	host: 'localhost',
	database: 'dbname',
	user: 'username',
	password: 'password',
});

connection.connect(err => {
	if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}
	console.log('Connected as id ' + connection.threadId);
});

router.post('', (req, res, next) => {
	// Add data to database
	connection.query();
	console.log('uploaded');
});

module.exports = router;