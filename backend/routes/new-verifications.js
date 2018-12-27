const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const router = express.Router();

const connection = require('../database/db');

// Values regex = \[.*?\] -> '%s'

// 1) Запит для отримання усіх повірок get
router.get('', (req, res, next) => {
  connection.query('SELECT * FROM new_verifications', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});
// 2) Додавання нової повірки post
router.post('', (req, res, next) => {
  let varData = (" VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');");
  let formatedData = varData.format(req.body.addingDate, req.body.applicationNumber, req.body.client, req.body.employee, req.body.district, req.body.street, req.body.house, req.body.flat, req.body.isRemoved, req.body.symbol, req.body.counterNumber, req.body.type, req.body.productionYear, req.body.status, req.body.serviceProvider, req.body.comment, req.body.note, req.body.taskDate, req.body.brigadeName, req.body.stationNumber);
  let varResult = ("INSERT INTO `new_verifications`(`Дата_надходження`, `Номер_заявки`, `Клієнт`, `ПІБ_Працівника`," +
    " `Район`, `Вулиця`, `Будинок`, `Квартира`, `Лічильник_демонтовано`, `Умовне_позначення`, `Номер_лічильника`," +
    " `Типорозмір_лічильника`, `Рік_випуску_лічильника`, `Статус`, `Надавач_послуг`, `Коментар`, `Примітка`, " +
    "`Дата_завдання`, `Назва_бригади`, `Номер_установки`)" + formatedData);

  connection.query(varResult, () => {
    res.status(201);
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
router.get('/:id', (req, res, next) => {
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
