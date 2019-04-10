const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

/**
 * @param req.params.id - номер заявки статус якої потрібно змінити
 */
router.get('/send/:id', (req, res, next) => {
  console.log( {
    id: req.params.id
  } );
  connection.query("UPDATE `archive` SET status = 'Проведено повірку' WHERE applicationNumber = '" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);      
    }
    res.status(201).send({
      msg: 'Статус заявки ' + req.params.id + ' змінено на: Проведено повірку '
    });
  });
});

/**
 * @param req.params.createFor - створено для
 */
router.get('/:createFor', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `status` LIKE 'Проведено%' AND `scanFile` IS NOT NULL AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

// 1. Відхилення заявки зі зміною статусу на "Відхилено" rejected
router.put('/rejected/:id', (req, res, next) => {
  let varResult = "UPDATE `archive` SET `status`='Відхилено' WHERE `applicationNumber`='" + req.params.id + "';";
  connection.query(varResult, () => {
		io.getIo().emit('update');
    res.status(200);
  });
});

module.exports = router;