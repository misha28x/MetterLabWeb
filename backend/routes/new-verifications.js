const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const router = express.Router();

const connection = require('../database/db');

// Values regex = \[.*?\] -> '%s'

// 1. Додавання нової повірки в Archive з усіма даними і статусом "Визначено відповідальну особу"
// TODO: Встановити PrimaryKey/Qnique
router.post('', (req, res, next) => {
  let varData = " VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
  let formatedData = varData.format(req.body.addingDate, req.body.applicationNumber, req.body.client, req.body.phoneNumber, req.body.region, req.body.index, req.body.district, req.body.settlement, req.body.street, req.body.house, req.body.apartment, req.body.serviceProvider, req.body.employeeName, req.body.serviceType, req.body.counterQuantity, req.body.isUnique, req.body.isDismantled, req.body.counterNumber, req.body.symbol, req.body.counterType, req.body.productionYear, req.body.montageDate, req.body.acumulatedVolume, req.body.haveSeal, null, "Визначено відповідальну особу", req.body.comment, req.body.note, req.body.taskDate, req.body.stationNumber, null, null, null, null, null, null, null, null);
  let varResult = ("INSERT INTO `archive`(`addingDate`, `applicationNumber`, `client`, `phoneNumber`, `region`, `cityIndex`, `district`, `settlement`, `street`, `house`, `apartment`, `serviceProvider`, `employeeName`, `serviceType`, `counterQuantity`, `isUnique`, `isDismantled`, `counterNumber`, `symbol`, `counterType`, `productionYear`, `montageDate`, `acumulatedVolume`, `haveSeal`, `sealNumber`, `status`, `comment`, `note`, `taskDate`, `stationNumber`, `laboratory`, `protocolDate`, `protocolNumber`, `protocolSignDate`, `suitableFor`, `documentPrintDate`, `idForStation`, `positionInTask`)" + formatedData);
  connection.query(varResult, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(201);
    console.log('Нова повірка створена. Визначено відповідальну особу');
  });
});

// 2. Відхилення заявки зі зміною статусу на "Відхилено" rejected
// TODO: пофіксити Update
router.put('/rejected/:id', (req, res, next) => {
  let varResult = "UPDATE `archive` SET `status`='Відхилено' WHERE `applicationNumber`='" + req.params.id + "';";
 connection.query(varResult, () => {
   res.status(200);
 });
});

// Запит для отримання усіх повірок get
router.get('', (req, res, next) => {
  connection.query('SELECT * FROM new_verifications', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

// З new werif select і в task_planinig з додаванням ПІБ потім видалити з new_verif
router.get('/employee/:id', (req, res, next) => {
  connection.query("SELECT * FROM new_verifications WHERE `Номер_заявки`='" + req.params.id + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
    let varData = (" VALUES ('%s', '%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');");
    let formatedData = varData.format(result[0].Дата_надходження, result[0].Номер_заявки, result[0].Клієнт, null, 'req.body.employee', result[0].Район, result[0].Вулиця, result[0].Будинок, result[0].Квартира, null, null, null, null, null, null, result[0].Примітка);

    let varResult = ("INSERT INTO `task_planing` (`Дата_надходження`, `Номер_заявки`, `Клієнт`, `Надавач_послуг`,`ПІБ_працівника`, `Район`, `Вулиця`, `Будинок`, `Квартира`, `Бажана_дата_повірки`, `Бажаний_час_повірки`, `Справність_сантехніки`, `Вода_відсутня_до`, `Наявність_пломби`, `Телефон`, `Примітка`)" + formatedData);

    connection.query(varResult, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        connection.query("DELETE FROM `new_verifications` WHERE `Номер_заявки`='" + req.params.id + "';", (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });
  // req.params.id - це номер заявки
  // req.body.employee - ПІБ
});

// 2) Додавання нової повірки post
router.post('1', (req, res, next) => {
  let varData = (" VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');");
  let formatedData = varData.format(req.body.addingDate, req.body.applicationNumber, req.body.client, req.body.employee, req.body.district, req.body.street, req.body.house, req.body.flat, req.body.isRemoved, req.body.symbol, req.body.counterNumber, req.body.type, req.body.productionYear, req.body.status, req.body.serviceProvider, req.body.comment, req.body.note, req.body.taskDate, req.body.brigadeName, req.body.stationNumber);
  // TODO: в task_planing
  let varResult = ("INSERT INTO `new_verifications`(`Дата_надходження`, `Номер_заявки`, `Клієнт`, `ПІБ_Працівника`," +
    " `Район`, `Вулиця`, `Будинок`, `Квартира`, `Лічильник_демонтовано`, `Умовне_позначення`, `Номер_лічильника`," +
    " `Типорозмір_лічильника`, `Рік_випуску_лічильника`, `Статус`, `Надавач_послуг`, `Коментар`, `Примітка`, " +
    "`Дата_завдання`, `Назва_бригади`, `Номер_установки`)" + formatedData);

  connection.query(varResult, (err) => {
    if (err) console.log(err);

    res.status(201);
    console.log('added');
  });
});

// 3) Редагуваня повірки put
router.put('/:id', (req, res, next) => {
  let varData = "`Дата_надходження`='%s',`Клієнт`='%s',`ПІБ_Працівника`='%s',`Район`='%s',`Вулиця`='%s',`Будинок`='%s',`Квартира`='%s',`Лічильник_демонтовано`='%s',`Умовне_позначення`='%s',`Номер_лічильника`='%s',`Типорозмір_лічильника`='%s',`Рік_випуску_лічильника`='%s',`Статус`='%s',`Надавач_послуг`='%s',`Коментар`='%s',`Примітка`='%s',`Дата_завдання`='%s',`Назва_бригади`='%s',`Номер_установки`='%s'";
  let formatedData = varData.format(req.body.addingDate, req.body.client, req.body.employee, req.body.district, req.body.street, req.body.house, req.body.flat, req.body.isRemoved, req.body.symbol, req.body.counterNumber, req.body.type, req.body.productionYear, req.body.status, req.body.serviceProvider, req.body.comment, req.body.note, req.body.taskDate, req.body.brigadeName, req.body.stationNumber);
  let varResult = "UPDATE new_verifications SET " + formatedData + " WHERE Номер_заявки = '" + req.params.id + "';";;

  connection.query(varResult, () => {
    res.status(200);
  });
});

// 4) Видалення повірки delete
router.delete('/:id', (req, res, next) => {
  let query = "DELETE FROM `new_verifications` WHERE `Номер_заявки`='" + req.params.id + "';";

  connection.query(query, () => {
    res.status(200);
  });
});

// Перевірка на дублі по адресі клієнта (район, вулиця, будинок, квартира)
router.post('/duplicate', (req, res, next) => {
  connection.query("SELECT * FROM `new_verifications` WHERE " +
    "(`Район`='" + req.body.district +
    "', `Вулиця`= '" + req.body.street +
    "', `Будинок`= '" + req.body.house +
    "', `Квартира` = '" + req.body.flat + "');", (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json(result);
    });
});

module.exports = router;
