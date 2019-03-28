const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');
// TODO: протоколи, де статус "Повірено. Не придатний"

/**
 * @param req.params.createFor - створено для
 */
// створено для
router.get('/:createFor', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `status` = 'Повірено. Непридатний' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

module.exports = router;
