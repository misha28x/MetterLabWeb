const express = require('express');
const mysql = require('mysql');

const router = express.Router();

let con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'water'
});

con.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Connnected');
	}
});

router.get('', (req, res, next) => {
	con.query('SELECT * FROM main', (err, result) => {
		if (err) {
			console.log(err);
		}
		res.status(200).json(result);
	});
});

module.exports = router;