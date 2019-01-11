const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

router.get('', (req, res, next) => {
  connection.query('SELECT * FROM task_planing', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/employee/:id', (req, res, next) => {
  connection.query("SELECT * FROM task_planing WHERE `Номер_заявки`='" + req.params.id + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
		res.send(result);
		// TODO: brigate_tasks i provider_request
		// TODO: змінити поля під інсерт для таблички
    let varData = (" VALUES ('%s', '%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');");
    let formatedData = varData.format(result[0].Дата_надходження, result[0].Номер_заявки, result[0].Клієнт, null, null, result[0].Район, result[0].Вулиця, result[0].Будинок, result[0].Квартира, null, null, null, null, null, null, result[0].Примітка);

    let varResult = ("INSERT INTO `new_verifications` (`Дата_надходження`, `Номер_заявки`, `Клієнт`, `Надавач_послуг`,`ПІБ_працівника`, `Район`, `Вулиця`, `Будинок`, `Квартира`, `Бажана_дата_повірки`, `Бажаний_час_повірки`, `Справність_сантехніки`, `Вода_відсутня_до`, `Наявність_пломби`, `Телефон`, `Примітка`)" + formatedData);

    connection.query(varResult, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        connection.query("DELETE FROM `task_planing` WHERE `Номер_заявки`='" + req.params.id + "';", (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
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
