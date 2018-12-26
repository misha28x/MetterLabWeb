const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

// Отримання непризначених заявок (Працівник чи статус не призначений)
router.get('', (req, res, next) => {
  connection.query("SELECT `Дата_надходження`, `Вулиця` FROM new_verifications WHERE " +
    "(`ПІБ_Працівника` is null or `ПІБ_Працівника` = '' or `Статус` is null or `Статус` = '');", (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json(result);
    });
});

module.exports = router;
