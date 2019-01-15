const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');
// TODO: протоколи, де статус "Повірено. Не придатний"
router.get('', (req, res, next) => {
  connection.query('SELECT * FROM dual', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

module.exports = router;
