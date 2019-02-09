const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

const formatDate = require('../utils/utils').formatDate;

router.get('', (req, res, next) => {
  connection.query('SELECT * FROM archive', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

// 3) Редагуваня повірки put
router.put('/edit/:id', (req, res, next) => {
  let varData = "`addingDate`='%s',`client`='%s',`employeeName`='%s',`district`='%s',`street`='%s',`house`='%s',`apartment`='%s',`entrance`='%s',`floor`='%s',`favorDate`='%s',`favorTime`='%s',`sanitaryWellfare`='%s',`waterAbsentTo`='%s',`isDismantled`='%s',`symbol`='%s',`counterNumber`='%s',`serviceType`='%s',`productionYear`='%s',`status`='%s',`serviceProvider`='%s',`comment`='%s',`note`='%s',`taskDate`='%s',`taskTime`='%s',`stationNumber`='%s'";
  let formatedData = varData.format(req.body.addingDate, req.body.client, req.body.employee, req.body.district, req.body.street, req.body.house, req.body.flat, req.body.entrance, req.body.floor, formatDate(req.body.favorDate)[0], formatDate(req.body.favorDate)[1], req.body.sanitaryWellfare, req.body.waterAbsentTo, req.body.isRemoved, req.body.symbol, req.body.counterNumber, req.body.type, req.body.productionYear, req.body.status, req.body.serviceProvider, req.body.comment, req.body.note, req.body.taskDate, /* TODO: taskTime */ req.body.taskTime, req.body.stationNumber);
  let varResult = "UPDATE archive SET " + formatedData + " WHERE applicationNumber = '" + req.params.id + "';";;

  connection.query(varResult, () => {
    res.status(200);
  });
});

router.get('/:id', (req, res, next) => {
  connection.query('SELECT * FROM `archive` WHERE `applicationNumber` =' + req.params.id + ';', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

module.exports = router;
