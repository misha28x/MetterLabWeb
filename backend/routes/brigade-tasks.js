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
  connection.query('SELECT * FROM brigade_tasks', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let query = "SELECT * FROM verifications_archive WHERE `id_для_бригади`='" + req.params.id + "';";

  connection.query(query, () => {
    res.status(200);
  });
});

module.exports = router;
