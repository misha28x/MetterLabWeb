const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

router.get('', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE  `status`='Визначено відповідальну особу';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});


// TODO: перевірити UPDATE
// 
router.get('/employee/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `status`='', `employeeName`='' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
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

      // Переміщення заявок в архів з додаванням id завдання
      req.body.verifications.forEach(applicationNumber => {
        // 1. Оновлення заявки зі зміною статусу на "В роботі" inprogress
        // TODO: протестувати Update
        let inProgressResult = "UPDATE `archive` SET `status`='В роботі', `idForStation`='" + id + "', `positionInTask`='" + position + "' WHERE `applicationNumber`='" + applicationNumber + "';";
        connection.query(inProgressResult);
        position++;
      });
    })
  })
});

// 2. Відхилення заявки зі зміною статусу на "Відхилено" rejected
// TODO: протестувати Update
router.put('/rejected/:id', (req, res, next) => {
  let varResult = "UPDATE `archive` SET `status`='Відхилено' WHERE `applicationNumber`='" + req.params.id + "';";
  connection.query(varResult, () => {
    res.status(200);
  });
});
module.exports = router;
