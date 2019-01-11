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

// Роутер, що переміщає заявку в архів повірок
router.post('/station-task', (req, res, next) => {
  let taskAdding = " VALUES ('%s','%s','%s','%s','%s','%s');";
  let taskAddingFormat = taskAdding.format(req.body.taskDate, req.body.type, req.body.number, req.body.employeeName, req.body.phoneNumber, req.body.count);
  let taskAddingResult = "INSERT INTO `station_tasks`(`Дата_завдання`, `Тип_установки`, " +
    " `Номер_установки`, `ПІБ_контактної_особи`, `Номер_телефону`, `Кількість_заявок`)" + taskAddingFormat;

  let getTasksId = "SELECT id_завдання FROM `station_tasks` ORDER BY `id_завдання` DESC;";

  // Запит на додавання завдання в station tasks
  connection.query(taskAddingResult, (err) => {
    // Запит на отримання id завдання з station tasks
    connection.query(getTasksId, (err, rows) => {

      const id = rows[0].id_завдання;
			let position = 1;
      /** дата надходження - номер телефону (ver.(verifications)) 
       * статус - уповноважен. лаб null
       * номер установки(req.body.number)
       * дата ств прот, номер прот, дата підп - null
			 * уомвне познач - (ver.(verifications) symbol + type)
			 * номер ліч, рік випуску - null
			 * лічильник демонтовано - (ver.(verifications))
			 * номер пломби, придатн. надавач посл - null
			 * тип послуги, дата вид документ - null
			 * коментар, дата монтажу - (ver.(verifications))
			 * дата завдання(req.body.taskDate)
			 * назва бригади  -null
			 * примітка - (ver.(verifications))
			 * id бриг - null
			 * id station - id
			 * позиція завдання - position
       */

      // Переміщення заявок в архів з додаванням id завдання
      req.body.verifications.forEach(ver => {
        let migrationToArchive = " VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
        let migrationToArchiveFormat = migrationToArchive.format(ver.addingDate, ver.applicationNumber, ver.client, ver.city, ver.street, ver.house, ver.flat, ver.index, ver.phoneNumber, null, null, req.body.number, null, null, null, (ver.symbol + ' ' + ver.type), ver.counterNumber, ver.productionYear, null, null, null, ver.serviceProvider, null, null, ver.comment, null, null, ver.brigadeName, ver.note, null, id, position);
        let migrationToArchiveResult = "INSERT INTO `verifications_archive`(`Дата_надходження`, `Номер_заявки`, `Клієнт`, `Населений_пункт`, `Вулиця_клієнта`, `Будинок`, `Квартира`, `Індекс`, `Номер_телефону`, `Статус`, `Уповноважена_повірочна_лабораторія`, `Номер_установки`, `Дата_створення_протоколу`, `Номер_протоколу`, `Дата_підпису_протоколу`, `Умовне_позначення`, `Номер_лічильника`, `Рік_випуску_лічильника`, `Лічильник_демонтовано`, `Номер_пломби`, `Придатний_до`, `Надавач_послуг`, `Тип_послуги`, `Дата_видачі_документу`, `Коментар`, `Дата_монтажу_лічильника`, `Дата_завдання`, `Назва_бригади`, `Примітка`, `id_для_бригади`, `id_для_станції`, `позиція_завдання`) " + migrationToArchiveFormat;
				connection.query(migrationToArchiveResult);
				position++;
      });
    })
  })
});

module.exports = router;
