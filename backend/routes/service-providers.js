const express = require('express');
const mysql = require('mysql');

const connection = require('../database/db');

const router = express.Router();

// створено для
router.get('/provider/:id/:createFor', (req, res, next) => {
	connection.query("SELECT * FROM `archive` WHERE `userId`='" + req.params.id + "' AND (`status`='Не визначено відповідальну особу' OR `status`='') AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
		if (err) {
			res.json(err);
		}
		res.json(result);
	});
});

module.exports = router;
