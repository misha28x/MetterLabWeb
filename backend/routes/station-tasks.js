const express = require('express');
const mysql = require('mysql');
const xl = require('excel4node');

const generateExcel = require('../utils/utils').generateExcelFile;

const router = express.Router();

const connection = require('../database/db');

router.get('', (req, res, next) => {
  connection.query('SELECT * FROM station_tasks', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let query = "SELECT * FROM archive WHERE `idForStation`='" + req.params.id +
    "' ORDER BY `positionInTask` ASC;";

  connection.query(query, (err, rows) => {
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
	console.log('resolved');
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


router.get('/unresolved/:id', (req, res, next) => {
  console.log('resolved');
  connection.query("SELECT `addingDate`, `serviceProvider`, `client`, `district`, `street`, `house`,`apartment`,`entrance`,`floor`, `phoneNumber`, `taskTime`, `note` from archive WHERE `idForStation`='" + req.params.id + "' AND (status NOT LIKE 'Проведено%' AND status NOT LIKE 'Надіслано%' AND status NOT LIKE 'Повірено%') ORDER BY `positionInTask` DESC;", (err, rows) => {
    if (err) {
      console.log(err);
      res.json({
        err: err
      });
    }
    res.json(rows);
  });
});

// TODO: Видалити заявку з завдання `stations-task` get(:id)
router.get('/delete/:id', (req, res) => {
  connection.query("UPDATE `archive` SET `idForStation`='0', `positionInTask`='0', `status`='Визначено відповідальну особу' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
      res.json({m : err });
    }
    res.json({m: 'success'});
  });
});

// TODO: винесено generateExcel
router.get('/excel/:id', (req, res, next) => {
  let query = "SELECT * FROM archive WHERE `idForStation`='" + req.params.id + "' ORDER BY `positionInTask` DESC;";
  connection.query(query, (err, taskResult) => {
    if (err) {
      console.log(error);
    }
    const stringName = "Default zzz";
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

module.exports = router;
