const express = require('express');
const mysql = require('mysql');
const io = require('../socket/socket');
const formatDate = require('../utils/utils').formatDate;
const connection = require('../database/db');

const router = express.Router();

// створено для
router.get('/:createFor', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE  `status` = 'Визначено відповідальну особу' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});


router.get('/employee/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `status`='', `employeeName`='' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
  });
});

router.get('/stations/:serviceProvider', (req, res, next) => {
  connection.query("SELECT `stationNumber` FROM stations WHERE 	serviceProvider = '" + req.params.serviceProvider + "';", (err, station) => {
    res.send(station);
  });
});

/** 
 * @param req.body.serviceProvider
 */
// Роутер, що переміщає заявку в архів повірок
router.post('/station-task', (req, res, next) => {
  console.log({
    data: req.body
  });

  connection.query("SELECT * FROM stations WHERE stationNumber='" + req.body.stationNumber + "';", (err, station) => {
    const stNumber = station[0].stationNumber;
    const emName = station[0].employeeName;
    const phNumber = station[0].phoneNumber;
    const eMail = station[0].contactEmail;

    let taskAdding = " VALUES ('%s','%s','%s','%s','%s','%s', '%s', '%s');";
    let taskAddingFormat = taskAdding.format(formatDate(req.body.taskDate)[0], "Переносна установка *", stNumber, emName, phNumber, eMail, req.body.verifications.length, req.body.serviceProvider);
    let taskAddingResult = "INSERT INTO `station_tasks`(`taskDate`, `stationType`, `stationNumber`, `contactName`, `phoneNumber`,`e_mail`, `verifCount`, `serviceProvider`)" + taskAddingFormat;

    let getTasksId = "SELECT id_task FROM `station_tasks` ORDER BY `id_task` DESC LIMIT 1;";

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
        if (err) {
          console.log(err);
        }
        console.log(rows);
        let id = rows[0].id_task;
        
        if (rows.length > 0) {
          id = rows[0].id_task;
        }

        let position = 0;

        // Переміщення заявок в архів з додаванням id завдання
        req.body.verifications.forEach(verefication => {
          // 1. Оновлення заявки зі зміною статусу на "В роботі" inprogress
          // TODO: протестувати Update
          // 2019-01-24T22:00:00.000Z          

          let inProgressResult = "UPDATE `archive` SET `status`='В роботі', `idForStation`='" + id + "', `positionInTask`='" + position + "', `taskDate`='" + formatDate(req.body.taskDate)[0] + "', `stationNumber`='" + req.body.stationNumber + "' WHERE `applicationNumber`='" + verefication.applicationNumber + "';";
          connection.query(inProgressResult, (err) => {
            if (err) {
              console.log(err);
            }
            io.getIo().emit('update');
          });
          position++;
        });
      })
    })
  });
  io.getIo().emit('update');
  res.send({
    message: 'success'
  });
});

/** 
 * Відхилення заявки зі зміною статусу на "Відхилено" rejected і зменшенням кількості заявок в завданні
 * 
 * @param req.params.id - номер заявки
 * @param req.body.id_task - id завдання з якого видаляють заявку
 * 
 * TODO: Відхилені завки мають залишатися в завданні ? , `idForStation`=0, `positionInTask`=0
 * */
router.put('/rejected/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `status`='Відхилено' WHERE `applicationNumber`='" + req.params.id + "';", () => {
    connection.query("UPDATE `station_tasks` SET verifCount = verifCount - 1 WHERE id_task = '" + req.body.id_task + "';", () => {
      io.getIo().emit('update');
      res.sendStatus(200);
    });
  });
});

router.put('/back/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `status`='Визначено відповідальну особу', `idForStation`=0, `positionInTask`=0 WHERE `applicationNumber`='" + req.params.id + "';", () => {
    connection.query("UPDATE `station_tasks` SET verifCount = verifCount - 1 WHERE id_task = '" + req.body.id_task + "';", () => {
      io.getIo().emit('update');
      res.sendStatus(200);
    });
  });
});

module.exports = router;
