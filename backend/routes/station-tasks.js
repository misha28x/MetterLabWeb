const express = require('express');
const mysql = require('mysql');
const xl = require('excel4node');

const generateExcel = require('../utils/utils').generateExcelFile;

const router = express.Router();
const io = require('../socket/socket');

const connection = require('../database/db');

router.get('/:serviceProvider', (req, res, next) => {
  connection.query("SELECT * FROM station_tasks WHERE `serviceProvider` = '" + req.params.serviceProvider + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});

// створено для
router.get('/tasks/:id', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `idForStation`='" + req.params.id + "' ORDER BY `favorTime` ASC;", (err, rows) => {
    if (err) {
      console.log(err);
      res.json({
        err: err
      });
    }
    res.json(rows);
  });
});

// "SELECT * FROM `station_tasks` WHERE `task_status` != 'Виконано'"
// TODO: додати перевірку за датою, щоб не виводило завдання, які ніяк не могли бути виконані
router.get('/failed/:id', (req, res, next) => {
  const currentDate = '' + new Date().getFullYear + '-' + (new Date().getMonth + 1) + '-' + new Date().getDay;
  connection.query("SELECT * FROM `station_tasks` WHERE `task_status` != 'Виконано' AND `taskDate` < '" + currentDate + "';", (err, rows) => {
    if (err) {
      console.log(err);
      res.json({
        err: err
      });
    }
    res.json(rows);
  });
});

// створено для
router.get('/unresolved/:id', (req, res, next) => {
  console.log('resolved');
  connection.query("SELECT * FROM `archive` WHERE `idForStation`=" + parseInt(req.params.id) + "' ORDER BY `favorTime` DESC", (err, rows) => {
    if (err) {
      console.log(err);
      res.json({
        err: err
      });
    }
    console.log(rows);
    res.json(rows);
  });
});

router.post('/delete/:id', (req, res) => {
  connection.query("UPDATE `archive` SET `idForStation`='0', `positionInTask`='0', `status`='Визначено відповідальну особу' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    connection.query("UPDATE `station_tasks` SET verifCount = verifCount - 1 WHERE id_task = '" + req.body.id_task + "';", () => {
      io.getIo().emit('update');
      res.sendStatus(200);
    });
  });
});

// TODO: винесено generateExcel
// створено для
router.get('/excel/:id', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `idForStation`='" + req.params.id + "' ORDER BY `favorTime` DESC;", (err, taskResult) => {
    if (err) {
      console.log(error);
    }
    const taskDate = taskResult[0].taskDate.split('-')[2] + taskResult[0].taskDate.split('-')[1] + taskResult[0].taskDate.split('-')[0];
    const stringName = taskResult[0].stationNumber + "-" + taskDate;
    generateExcel(taskResult, stringName).then(name => {
      res.download(name);
    });
  });
});

router.post('/position', (req, res, next) => {
  req.body.forEach(ver => {
    let query = "UPDATE `archive` SET `positionInTask`='" +
      ver.position + "' WHERE `idForStation`='" + ver.stationId + "';";

    connection.query(query, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  res.status(200);
})

router.put('/change/:id', (req, res, next) => {
  connection.query("UPDATE `station_tasks` SET `stationNumber` = " + req.body.stationNumber + " WHERE `id_task` =" + req.params.id + " ;", (err) => {
    if (err) {
      console.log(err);
    }
  });
});

module.exports = router;
