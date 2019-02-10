const express = require('express');
const mysql = require('mysql');
const connection = require('../database/db');

const generateExcel = require('../utils/utils').generateExcelFile;

const router = express.Router();

// Звіт: `заявки в роботі` (по даті додання зі статусом `Визначено відповідальну особу`)
router.get("/in-progress/single/:date", (req, res, next) => {
  connection.query( "SELECT * FROM `archive` WHERE `addingDate` = '" + req.params.date + "' AND `status` = 'Визначено відповідальну особу' OR `status` = 'В роботі';", ( err, result ) => {
    const stringName = "Заявки в роботі " + req.params.date;
    generateExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `заявки в роботі` для діапазону (по даті додання зі статусом `Визначено відповідальну особу`)
router.get("/in-progress/range/:date", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE (`addingDate` BETWEEN '" + req.params.date.split('-')[0] + "' AND '" + req.params.date.split('-')[1] + "') AND `status` = 'Визначено відповідальну особу';", (err, result) => {
    const stringName = "Заявки в роботі з " + req.params.date.split('-')[0] + "-" + req.params.date.split('-')[1];
    generateExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `по виконаних завданнях` (по `task_date` зі статусом like `Проведено повірку%`)
router.get("/completed/single/:date", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `taskDate` = '" + req.params.date + "' AND `status` LIKE 'Проведено повірку%';", (err, result) => {
    const stringName = "Виконані заявки " + req.params.date;
    generateExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `по виконаних завданнях` для діапазону дат (по `task_date` зі статусом like `Проведено повірку%`)
router.get("/completed/range/:date", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE (`taskDate` BETWEEN '" + req.params.date.split('-')[0] + "' AND '" + req.params.date.split('-')[1] + "') AND `status` LIKE 'Проведено повірку%';", (err, result) => {
    const stringName = "Виконані заявки з " + req.params.date.split('-')[0] + "-" + req.params.date.split('-')[1];
    generateExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: конверт (все в діапазоні `Дата додання`)
router.get("/convert", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `addingDate` BETWEEN '" + req.params.date.split('-')[0] + "' AND '" + req.params.date.split('-')[1] + "';", (err, result) => {
		    const stringName = "Конверт з " + req.params.date.split('-')[0] + "-" + req.params.date.split('-')[1];
		    generateExcel(result, stringName).then(name => {
		      res.download(name);
		    });
  });
});
module.exports = router;
