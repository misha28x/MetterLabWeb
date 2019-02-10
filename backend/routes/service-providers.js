const express = require('express');
const mysql = require('mysql');

const connection = require('../database/db');

const router = express.Router();

router.get('/provider/:id', (req, res, next) => {
	connection.query("SELECT * FROM `archive` WHERE `userId`='" + req.params.id + "' AND (`status`='Не визначено відповідальну особу' OR `status`='');", (err, result) => {
		if (err) {
			res.json(err);
		}
		res.json(result);
	});
});

module.exports = router;
