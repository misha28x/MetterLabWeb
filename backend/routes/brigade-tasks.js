const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

router.get('', (req, res, next) => {
  connection.query('SELECT * FROM brigade_tasks', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let query = "SELECT * FROM verifications_archive WHERE `id_для_бригади`='" + req.params.id + "' ORDER BY `позиція_завдання` DESC;";

  connection.query(query, () => {
    res.status(200);
  });
});

router.post('/position', (req, res, next) => {
  req.body.forEach(ver => {
    let query = "UPDATE `verifications_archive` SET `позиція_завдання`='" +
      ver.position + "' WHERE `id_для_бригади`='" + ver.stationId + "';";

    connection.query(query, () => {
      res.status(200);
    });
  });
})

// Роутер, що переміщає заявку в архів повірок
router.post('', (req, res, next) => {
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
       * номер установки - null (?)
       * дата ств прот, номер прот, дата підп - null
       * уомвне познач - (ver.(verifications) symbol + type)
       * номер ліч, рік випуску - null
       * лічильник демонтовано - (ver.(verifications))
       * номер пломби, придатн. надавач посл - null
       * тип послуги, дата вид документ - null
       * коментар, дата монтажу - (ver.(verifications))
       * дата завдання(req.body.taskDate)
       * назва бригади - req.body.name
       * примітка - (ver.(verifications))
       * id бриг - id
       * id station - null
       * позиція завдання - position
       */

      // Переміщення заявок в архів з додаванням id завдання
      req.body.verifications.forEach(ver => {
        let migrationToArchive = " VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
        let migrationToArchiveFormat = migrationToArchive.format(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, id, null);
        let migrationToArchiveResult = "INSERT INTO `verifications_archive`(`Дата_надходження`, `Номер_заявки`, `Клієнт`, `Населений_пункт`, `Вулиця_клієнта`, `Будинок`, `Квартира`, `Індекс`, `Номер_телефону`, `Статус`, `Уповноважена_повірочна_лабораторія`, `Номер_установки`, `Дата_створення_протоколу`, `Номер_протоколу`, `Дата_підпису_протоколу`, `Умовне_позначення`, `Номер_лічильника`, `Рік_випуску_лічильника`, `Лічильник_демонтовано`, `Номер_пломби`, `Придатний_до`, `Надавач_послуг`, `Тип_послуги`, `Дата_видачі_документу`, `Коментар`, `Дата_монтажу_лічильника`, `Дата_завдання`, `Назва_бригади`, `Примітка`, `id_для_бригади`, `id_для_станції`, `позиція_завдання`) " + migrationToArchiveFormat;
        connection.query(migrationToArchiveResult);
        position++;
      });
    })
  })
});

module.exports = router;
