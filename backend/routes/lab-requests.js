const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'water_counters',
  user: 'root',
  password: '',
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

router.get('', (req, res, next) => {
  connection.query('SELECT * FROM lab_requests', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

module.exports = router;