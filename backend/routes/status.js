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
  connection.query("SELECT protocols.symbol, protocols.type, archive.productionYear, archive.acumulatedVolume, archive.serviceProvider, archive.scanFile, archive.protocolSignDate,  archive.status , protocols.image, FROM archive INNER JOIN protocols ON archive.protocolNumber = protocols.bbiFileName WHERE archive.applicationNumber = '" + req.params.id + "';", (err, status) => {
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
  connection.query("SELECT protocols.symbol, protocols.type, archive.productionYear, archive.acumulatedVolume, archive.serviceProvider, archive.scanFile, archive.protocolSignDate, archive.status ,protocols.image FROM archive INNER JOIN protocols ON archive.protocolNumber = protocols.bbiFileName WHERE archive.counterNumber = '" + req.params.id + "';", (err, status) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(status);
  });
});

module.exports = router;