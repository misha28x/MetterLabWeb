const express = require('express');
const mysql = require('mysql');
const connection = require('../database/db');

const generateReportExcel = require('../utils/utils').generateReportExcel;

const router = express.Router();

// Звіт: `заявки в роботі` (по даті додання зі статусом `Визначено відповідальну особу`)
// створено для
router.get("/in-progress/single/:date/:createFor", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `addingDate` = '" + req.params.date + "' AND (`status` = 'Визначено відповідальну особу' OR `status` = 'В роботі') AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    const stringName = "Заявки в роботі " + req.params.date;
    generateReportExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `заявки в роботі` для діапазону (по даті додання зі статусом `Визначено відповідальну особу`)
// створено для
router.get("/in-progress/range/:date/:createFor", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE (`addingDate` BETWEEN '" + req.params.date.split(',')[0] + "' AND '" + req.params.date.split(',')[1] + "') AND (`status` = 'Визначено відповідальну особу' OR `status` = 'В роботі') AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    console.log({
      dates: req.params.date
    });

    const stringName = "Заявки в роботі з " + req.params.date.split(',')[0] + "-" + req.params.date.split(',')[1];
    generateReportExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `по виконаних завданнях` (по `task_date` зі статусом like `Проведено повірку%`)
// створено для
router.get("/completed/single/:date/:createFor", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `taskDate` = '" + req.params.date + "' AND `status` LIKE 'Проведено повірку%' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    const stringName = "Виконані заявки " + req.params.date;
    generateReportExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `по виконаних завданнях` для діапазону дат (по `task_date` зі статусом like `Проведено повірку%`)
// створено для
router.get("/completed/range/:date/:createFor", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE (`taskDate` BETWEEN '" + req.params.date.split(',')[0] + "' AND '" + req.params.date.split(',')[1] + "') AND `status` LIKE 'Проведено повірку%' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    const stringName = "Виконані заявки з " + req.params.date.split(',')[0] + "-" + req.params.date.split(',')[1];
    generateReportExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `по відхиленим повіркам` (по `task_date` зі статусом like `%ідхилено%`)
// створено для
router.get("/rejected/single/:date/:createFor", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `taskDate` = '" + req.params.date + "' AND `status` LIKE '%ідхилено%' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    const stringName = "Відхилені повірки " + req.params.date;
    generateReportExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: `по відхиленим повіркам` для діапазону дат (по `task_date` зі статусом like `%ідхилено%`)
// створено для
router.get("/rejected/range/:date/:createFor", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE (`taskDate` BETWEEN '" + req.params.date.split(',')[0] + "' AND '" + req.params.date.split(',')[1] + "') AND `status` LIKE '%ідхилено%' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    const stringName = "Відхилені повірки " + req.params.date.split(',')[0] + "-" + req.params.date.split(',')[1];
    generateReportExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

// Звіт: конверт (все в діапазоні `Дата додання`)
// створено для
router.get("/convert/range/:date/:createFor", (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `addingDate` BETWEEN '" + req.params.date.split(',')[0] + "' AND '" + req.params.date.split(',')[1] + "' AND `createFor` = '" + req.params.createFor + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    const stringName = "Конверт з " + req.params.date.split(',')[0] + "-" + req.params.date.split(',')[1];
    generateReportExcel(result, stringName).then(name => {
      res.download(name);
    });
  });
});

module.exports = router;
