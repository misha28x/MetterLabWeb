const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');
// TODO: видалити табличку verications-protocols
router.get('', (req, res, next) => {
  connection.query('SELECT * FROM results', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let query = "SELECT * FROM protocols WHERE `Номер_заявки`='" + req.params.id + "';";

  connection.query(query, () => {
    res.status(200);
  });
});

module.exports = router;
