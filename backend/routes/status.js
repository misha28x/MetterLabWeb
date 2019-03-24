const express = require('express');
const mysql = require('mysql');

const connection = require('../database/db');

const router = express.Router();

/**
 * Отримання статусу повірки за номером
 * @param req.params.id - номер повірки
 * 
 * @returns status повірки
 */
router.get('/verification/:id', (req, res, next) => {
  connection.query("SELECT `status` FROM `archive` WHERE `applicationNumber` = '" + req.params.id + "' ;", (err, status) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(status);
  });
});

/**
 * Отримання статусу повірки за номером лічильника
 * @param req.params.id - номер лічильника
 * 
 * @returns status повірки
 */
router.get('/counter/:id', (req, res, next) => {
  connection.query("SELECT `status` FROM `archive` WHERE `counterNumber` = '" + req.params.id + "' ;", (err, status) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(status);
  });
});

module.exports = router;