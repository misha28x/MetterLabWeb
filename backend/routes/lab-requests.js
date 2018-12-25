const express = require('express');
const mysql = require('mysql');

const router = express.Router();

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'water_counters'
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');
  }
});

router.get('', (req, res, next) => {
  connection.query('SELECT * FROM results', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

module.exports = router;