const express = require('express');
const mysql = require('mysql');
const connection = require('../database/db');

const generateExcel = require('../utils/utils').generateExcelFile;

const router = express.Router();

// Звіт: `заявки в роботі` (по даті додання зі статусом `Визначено відповідальну особу`)
router.get("/in-progress/single/", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `addingDate` = '" + req.body.Date + "' AND `status` = 'Визначено відповідальну особу';", (err, result) => {
    const stringName = "Заявки в роботі " + req.body.Date;
    generateExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `заявки в роботі` для діапазону (по даті додання зі статусом `Визначено відповідальну особу`)
router.post("/in-progress/range/", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE (`addingDate` BETWEEN '" + req.body.startDate + "' AND '" + req.body.endDate + "') AND `status` = 'Визначено відповідальну особу';", (err) => {
    const stringName = "Заявки в роботі з " + req.body.startDate + "-" + req.body.endDate;
    generateExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `по виконаних завданнях` (по `task_date` зі статусом like `Проведено повірку%`)
router.post("/completed/single", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `taskDate` = '" + req.body.Date + "' AND `status` LIKE 'Проведено повірку%';", (err) => {
    const stringName = "Виконані заявки " + req.body.Date;
    generateExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `по виконаних завданнях` для діапазону дат (по `task_date` зі статусом like `Проведено повірку%`)
router.post("/completed/range/", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE (`taskDate` BETWEEN '" + req.body.startDate + "' AND '" + req.body.endDate + "') AND `status` LIKE 'Проведено повірку%';", (err) => {
    const stringName = "Виконані заявки з " + req.body.startDate + "-" + req.body.endDate;
    generateExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: конверт (все в діапазоні `Дата додання`)
router.post("/convert/", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `addingDate` BETWEEN '" + req.body.startDate + "' AND '" + req.body.endDate + "';", (err) => {
		    const stringName = "Конверт з " + req.body.startDate + "-" + req.body.endDate;
		    generateExcel(result, stringName).then(name => {
		      res.download(name);
		    });
  });
});
module.exports = router;
