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

// TODO: виведення невиконаних заявок в завданні за номером для станції
// !! перевірити правильність умов !!
router.get('/unresolved/:id', (req, res, next) => {
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
    }
  });
});

// TODO: Вивести завдання в яких є невиконані заявки
router.get('/unresolved/', (req, res, next) => {
  console.log('unresolved');
  // В цьому масиві зберігатимуться примітиви з id недовиконаних завдань
  let unresolvedTaskIds = [];
  // вибираємо унікальні номери завдань, які мають свій ідентифікатор
  connection.query("SELECT DISTINCT idForStation FROM archive WHERE idForStation != 0;", (err, taskIds) => {
    if (err) {
      console.log(err);
    }
    // для кожного завдання виконуємо наступне
    taskIds.forEach(stationTask => {
      // отримуємо значення заявок зі статусами і всіх заявок де idForStation
      connection.query("SELECT (SELECT COUNT(*) FROM `archive` WHERE idForStation='" + stationTask.idForStation + "' AND (status LIKE 'Проведено%' OR status LIKE 'Надіслано%' OR status LIKE 'Повірено%')) AS resolved_counter, (SELECT COUNT(*) FROM `archive` WHERE idForStation='" + stationTask.idForStation + "') AS all_counter FROM dual;", (err, counters) => {
        if (err) {
          console.log(err);
        }
        // якщо виконаних заявок менше ніж всіх для завданнях, то її idForStation заносимо в масив
        if (counters[0].resolved_counter < counters[0].all_counter) {
          unresolvedTaskIds.push(stationTask.idForStation);
        }
      });
    });
    res.json(unresolvedTaskIds);
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
