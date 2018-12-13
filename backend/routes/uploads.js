const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const router = express.Router();

const connection = mysql.createConnection({
	host: 'localhost',
	database: 'water_counters',
	user: 'root',
	password: 'root',
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
	connection.query('INSERT INTO `names`(`name`) VALUES (\'fuck you\');');
	console.log('uploaded');
	// req.body - весь протокол 
	// req.body.test - тести і так далі 
});

module.exports = router;