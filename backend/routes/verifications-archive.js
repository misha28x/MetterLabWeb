const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

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
  let varData = "`addingDate`='%s',`client`='%s',`employeeName`='%s',`district`='%s',`street`='%s',`house`='%s',`apartment`='%s',`favorDate`='%s',`sanitaryWellfare`='%s',`waterAbsentTo`='%s',`isDismantled`='%s',`symbol`='%s',`counterNumber`='%s',`serviceType`='%s',`productionYear`='%s',`status`='%s',`serviceProvider`='%s',`comment`='%s',`note`='%s',`taskDate`='%s',`stationNumber`='%s'";
  let formatedData = varData.format(req.body.addingDate, req.body.client, req.body.employee, req.body.district, req.body.street, req.body.house, req.body.flat, req.body.favorDate, req.body.sanitaryWellfare, req.body.waterAbsentTo, req.body.isRemoved, req.body.symbol, req.body.counterNumber, req.body.type, req.body.productionYear, req.body.status, req.body.serviceProvider, req.body.comment, req.body.note, req.body.taskDate, req.body.stationNumber);
  let varResult = "UPDATE archive SET " + formatedData + " WHERE applicationNumber = '" + req.params.id + "';";;

  connection.query(varResult, () => {
    res.status(200);
  });
});

module.exports = router;
