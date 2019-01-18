const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

router.get('', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE  `status` = 'Визначено відповідальну особу';", (err, result) => {
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

router.get('/stations', (req, res, next) => {
  connection.query("SELECT `stationNumber` FROM stations;", (err, station) => {
    res.send(station);
  });
});

// Роутер, що переміщає заявку в архів повірок
router.post('/station-task', (req, res, next) => {
  console.log({
    data: req.body
  });
  connection.query("SELECT * FROM stations;", (err, station) => {
    const stNumber = station[0].stationNumber;
    const emName = station[0].employeeName;
    const phNumber = station[0].phoneNumber;
    const eMail = station[0].contactEmail;

    let taskAdding = " VALUES ('%s','%s','%s','%s','%s','%s', '%s');";
    let taskAddingFormat = taskAdding.format(req.body.taskDate, "Переносна установка*", stNumber, emName, phNumber, eMail, req.body.verifications.length);
    let taskAddingResult = "INSERT INTO `station_tasks`(`taskDate`, `stationType`, " + " `stationNumber`, `contactName`, `phoneNumber`,`e_mail`, `verifCount`)" + taskAddingFormat;

    let getTasksId = "SELECT id_task FROM `station_tasks` ORDER BY `id_task` DESC;";

    // Запит на додавання завдання в station tasks
    connection.query(taskAddingResult, (err) => {
      // Запит на отримання id завдання з station tasks
      if (err) {
        console.log(err)
        res.json({
          sqlError: err
        });
        return;
      }
      connection.query(getTasksId, (err, rows) => {

        let id = 0;
        console.log(rows);
        if (rows.length > 0) {
          id = rows[0].id_task;
        }
        let position = 1;

        // Переміщення заявок в архів з додаванням id завдання
        req.body.verifications.forEach(applicationNumber => {
          // 1. Оновлення заявки зі зміною статусу на "В роботі" inprogress
          // TODO: протестувати Update
          let inProgressResult = "UPDATE `archive` SET `status`='В роботі', `idForStation`='" + id + "', `positionInTask`='" + position + "', `taskDate`='" + req.body.taskDate + ", `stationNumber`='" + req.body.stationNumber + "' WHERE `applicationNumber`='" + applicationNumber + "';";
          connection.query(inProgressResult);
          position++;
        });
      })
    })
  });
  res.send('success');
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
