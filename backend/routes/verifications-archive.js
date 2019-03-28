const express = require('express');
const mysql = require('mysql');
const multer = require('multer')

const router = express.Router();

const connection = require('../database/db');

const formatDate = require('../utils/utils').formatDate;
const currentDate = require('../utils/utils').currentDate;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/scans');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
});

// Недозвон
router.get('/ndz/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `note`='НДЗ " + currentDate() + "' WHERE `applicationNumber`=" + req.params.id + ";", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json();
  });
});

// Зміна номеру пломби
router.post('/seal/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `sealNumber`='" + req.body.number + "',`montageDate`='" + req.body.date + "', `note`='" + req.body.comment + "'  WHERE `applicationNumber` ='" + req.params.id + "';", (err) => {
    if (err) {
      res.json(err);
    }
  });
  res.json({
    application: req.params.id,
    sealNumber: req.body.number,
    montageDate: req.body.date,
    note: req.body.comment
  });
});

// Оновлення даних про клієнта
router.put('/client/upd/:id', (req, res, next) => {
  // "UPDATE archive SET client, email, phoneNumber, secondNumber, region, district, settlement, cityIndex, street, house, apartment FROM `archive` WHERE applicationNumber='" + req.params.id + "';"
  let varData = "`client`='%s',`email`='%s',`phoneNumber`='%s',`secondNumber`='%s',`region`='%s',`district`='%s',`settlement`='%s',`cityIndex`='%s',`street`='%s',`house`='%s',`apartment`='%s'";
  let formatedData = varData.format(req.body.client, req.body.email, req.body.phoneNumber, req.body.secondNumber, req.body.region, req.body.district, req.body.settlement, req.body.cityIndex, req.body.street, req.body.house, req.body.apartment);
  let varResult = "UPDATE archive SET " + formatedData + " WHERE applicationNumber = '" + req.params.id + "';";
  connection.query(varResult, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

// Отримання інформації про клієнта
// створено для
router.get('/client/:id/:createFor', (req, res, next) => {
  connection.query("SELECT client, email, phoneNumber, secondNumber, region, district, settlement, cityIndex, street, house, apartment FROM `archive` WHERE applicationNumber='" + req.params.id + "' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});

router.put('/client/:id', (req, res, next) => {
  console.log(req.body);
  res.status(200).send();
})
// POST запит для заміни service-provider заявки з номером req.params.id на переданий у req.body.provider
router.post('/service-provider/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `serviceProvider`='" + req.body.provider + "' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }

    res.json({
      m: 'Provider changed'
    })
  });
});

// Post запит на завантаження сканованого файлу
// створено для
router.get('/scan/:id/:createFor', (req, res, next) => {
  connection.query(`SELECT scanFile FROM archive WHERE applicationNumber = '${req.params.id}' AND createFor = '` + req.params.createFor + `'`, (err, result) => {
    if (err) {
      res.json({
        err: 'Database Error'
      });
    }

    res.download(`./backend/scans/${result[0].scanFile}`);
  });
});

router.post('/scan/:id', upload.single('scan'), (req, res, next) => {
  console.log(`UPDATE archive SET scanFile='${req.file.originalname}' WHERE applicationNumber = '${req.params.id}'`);
  connection.query(`UPDATE archive SET scanFile='${req.file.originalname}' WHERE applicationNumber = '${req.params.id}'`, (err, result) => {
    if (err) {
      res.json({
        err: 'Database Error'
      });
    }
    res.status(200).json({
      m: 'success'
    });
  });
});

// створено для
router.get('/:createFor', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `createFor` = '" + req.params.createFor + "' (`status` LIKE 'Повірено%' OR 'Передано %')", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

// 3) Редагуваня повірки put
router.put('/edit/:id', (req, res, next) => {
  let varData = "`addingDate`='%s',`client`='%s',`employeeName`='%s',`district`='%s',`street`='%s',`house`='%s',`apartment`='%s',`entrance`='%s',`floor`='%s',`favorDate`='%s',`favorTime`='%s',`sanitaryWellfare`='%s',`waterAbsentTo`='%s',`isDismantled`='%s',`symbol`='%s',`counterNumber`='%s',`serviceType`='%s',`productionYear`='%s',`status`='%s',`serviceProvider`='%s',`comment`='%s',`note`='%s',`taskDate`='%s',`stationNumber`='%s'";
  let formatedData = varData.format(req.body.addingDate, req.body.client, req.body.employee, req.body.district, req.body.street, req.body.house, req.body.flat, req.body.entrance, req.body.floor, formatDate(req.body.favorDate)[0], formatDate(req.body.favorTime)[1], req.body.sanitaryWellfare, formatDate(req.body.waterAbsentTo)[0], req.body.isRemoved, req.body.symbol, req.body.counterNumber, req.body.type, req.body.productionYear, req.body.status, req.body.serviceProvider, req.body.comment, req.body.note, formatDate(req.body.taskDate)[0], /* TODO: taskTime */ req.body.taskTime, req.body.stationNumber);
  let varResult = "UPDATE archive SET " + formatedData + " WHERE applicationNumber = '" + req.params.id + "';";

  connection.query(varResult, (err, rows) => {
    if (err) {
      console.log(err)
    }
    res.status(200).send({
      m: 'success'
    });
  });
});

// створено для
router.get('/:id/:createFor', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `applicationNumber` ='" + req.params.id + "' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

module.exports = router;
