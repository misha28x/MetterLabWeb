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
// TODO: видалити табличку verications-protocols
router.get('', (req, res, next) => {
<<<<<<< HEAD
  connection.query('SELECT * FROM result', (err, result) => {
=======
  connection.query('SELECT * FROM results', (err, result) => {
>>>>>>> 35d007cfb2ef0cfd829c810ed715470d850c9936
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
