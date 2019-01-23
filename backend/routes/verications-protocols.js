const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');
router.get('', (req, res, next) => {
  connection.query("SELECT archive.protocolDate, archive.protocolNumber, archive.applicationNumber, archive.status, archive.counterNumber, archive.sealNumber, archive.settlement, archive.district, archive.street, archive.house, archive.apartment, archive.comment, protocols.deviceNumber FROM archive LEFT JOIN protocols ON archive.protocolNumber = protocols.bbiFileName WHERE archive.status LIKE 'Проведено повірку%';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let selectionOne = "SELECT protocols.bbiFileName, archive.applicationNumber, protocols.date, protocols.deviceNumber, protocols.counterNumber, protocols.symbol,protocols.type, archive.serviceType, protocols.temperature, protocols.productionYear, archive.acumulatedVolume, protocols.latitude, protocols.longitude, protocols.status, protocols.result, protocols.protocolStatus, protocols.image FROM protocols INNER JOIN archive ON protocols.bbiFileName = archive.protocolNumber WHERE protocols.bbiFileName = '" + req.params.id + "';";

  connection.query(selectionOne, function (err, rows, fields) {
    if (err) throw err;

    let selection = "SELECT * FROM tests WHERE bbiFileName = '" + req.params.id + "';";

    connection.query(selection, function (err, testRows, fields) {
      if (err) throw err;
    
      let testArray = [];

      for (let i in testRows) {
        let rt = new Object();
        rt.id = testRows[i].id;
        rt.bbiFileName = testRows[i].bbiFileName;
        rt.name = testRows[i].name;
        rt.installedExes = testRows[i].installedExes;
        rt.etalonCapacity = testRows[i].etalonCapacity;
        rt.initValue = testRows[i].initValue;
        rt.finalValue = testRows[i].finalValue;
        rt.counterCapacity = testRows[i].counterCapacity;
        rt.testDuration = testRows[i].testDuration;
        rt.mediumExes = testRows[i].mediumExes;
        rt.isInZone = testRows[i].isInZone;
        rt.assumedFault = testRows[i].assumedFault;
        rt.calculatedFault = testRows[i].calculatedFault;
        rt.result = testRows[i].result;
        rt.startStateImage = testRows[i].startStateImage;
        rt.endStateImage = testRows[i].endStateImage;

        testArray.push(rt);
      }

      let rp = new Object();
      rp.applicationNumber = rows[0].applicationNumber;
      rp.protocolNumber = rows[0].bbiFileName;
      rp.date = rows[0].date;
      rp.deviceNumber = rows[0].deviceNumber;
      rp.systemNumber = rows[0].systemDeviceNumber;
      rp.counterNumber = rows[0].counterNumber;
      rp.symbol = rows[0].symbol;
      rp.type = rows[0].type;
      rp.serviceType = rows[0].serviceType;
      rp.temperature = rows[0].temperature;
      rp.productionYear = rows[0].productionYear;
      rp.acumulatedVolume = rows[0].acumulatedVolume;
      rp.latitude = rows[0].latitude;
      rp.longitude = rows[0].longitude;
      rp.isInZone = rows[0].status;
      rp.result = rows[0].result;
      rp.signDate = rows[0].signDate;
      rp.signName = rows[0].signPerson;
      rp.protocolStatus = rows[0].protocolStatus;
      rp.image = rows[0].image;
      rp.tests = [];

      rp.tests = testArray;

      res.status(200).send(rp);
    });
  });
});

// Оновлення протоколу
router.put('/:id', (req, res, next) => {
  // ! Передається все крім id і Номер_протококу !
  let varData = "`date`='%s',`deviceNumber`='%s',`systemDeviceNumber`='%s',`counterNumber`='%s', `symbol`='%s' ,`type`='%s',`counterPurpose`='%s',`temperature`='%s',`productionYear`='%s',`capacity`='%s',`latitude`='%s',`longitude`='%s',`status`='%s',`result`='%s',`signDate`='%s',`signPerson`='%s',`protocolStatus`='%s'";
  let formatedData = varData.format(req.body.date, req.body.deviceNumber, null, req.body.counterNumber, req.body.symbol, req.body.type, null, req.body.temperature, req.body.productionYear, req.body.capacity, req.body.latitude, req.body.longitude, req.body.status, req.body.result, null, null, req.body.protocolStatus);
  let varResult = "UPDATE protocols SET " + formatedData + " WHERE bbiFileName = '" + req.params.id + "';";

  connection.query(varResult);
  // ! Передається все крім id, Номер_протоколу, Назва_тесту !
  req.body.tests.forEach(test => {

    let varData = "`installedExes`='%s',`etalonCapacity`='%s',`initValue`='%s',`finalValue`='%s',`counterCapacity`='%s',`testDuration`='%s',`mediumExes`='%s',`isInZone`='%s',`assumedFault`='%s',`calculatedFault`='%s',`result`='%s',`startStateImage`='%s',`endStateImage`='%s'";
    let formatedData = varData.format(test.installedExes, test.etalonCapacity, test.initValue, test.finalValue, test.counterCapacity, test.testDuration, test.mediumExes, test.isInZone, test.assumedFault, test.calculatedFault, test.result, test.startStateImage, test.endStateImage);
    let varResult = "UPDATE tests SET " + formatedData + " WHERE bbiFileName = '" + req.params.id + "' AND name = '" + test.name + "';";

    connection.query(varResult);
  });

  res.status(200);
});

module.exports = router;
