const express = require('express');
const mysql = require('mysql');

const router = express.Router();

let con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'water_counters'
});

con.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected');
	}
});

router.get('', (req, res, next) => {
	con.query('SELECT * FROM new_applications', (err, result) => {
		if (err) {
			console.log(err);
		}
		res.status(200).json(result);
	});
});

module.exports = router;