const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

// Отримання непризначених заявок (Працівник чи статус не призначений)
// створено для
router.get('/:createFor', (req, res, next) => {
  connection.query("SELECT `addingDate`, `street` FROM `archive` WHERE `createFor` = '" + req.params.createFor + "' AND" +
    "(`employeeName` is null or `employeeName` = '' or `status` is null or `status` = '');", (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json(result);
    });
});

module.exports = router;
