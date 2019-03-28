const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

// створено для
router.get('/:createFor', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `createFor` = '" + req.params.createFor + "' AND `status` LIKE 'Відхилен%'", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/rejections', (req, res, next) => {
  connection.query("SELECT * FROM rejections_types;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

module.exports = router;
