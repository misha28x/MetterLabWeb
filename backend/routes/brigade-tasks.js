const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

router.get('', (req, res, next) => {
  connection.query('SELECT * FROM brigade_tasks', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let query = "SELECT * FROM verifications_archive WHERE `id_для_бригади`='" + req.params.id + "' ORDER BY `позиція_завдання` DESC;";

  connection.query(query, () => {
    res.status(200);
  });
});

router.post('/position', (req, res, next) => {
  req.body.forEach(ver => {
    let query = "UPDATE `verifications_archive` SET `позиція_завдання`='" +
      ver.position + "' WHERE `id_для_бригади`='" + ver.stationId + "';";

    connection.query(query, () => {
      res.status(200);
    });
  });
})

module.exports = router;
