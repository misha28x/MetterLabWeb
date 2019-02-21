const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const connection = require('../database/db');
const io = require('../socket/socket');

let socket;

const counters = {
  new_verifications: 0,
  task_planing: 0,
  lab_requests: 0,
  metrology: 0
};

// Роут, що повертає json з counters для конкретного permission користувача
router.get("/counters/:permission", (req, res, next) => {
  let countersQuery = "SELECT (SELECT COUNT(*)FROM `archive` WHERE `status`='Не визначено відповідальну особу' OR `status` IS NULL) AS new_verifications, (SELECT COUNT(*) FROM `archive` WHERE `status`='Визначено відповідальну особу') AS task_planing, (SELECT COUNT(*) FROM `archive` WHERE `status`='Проведено повірку на місці') AS lab_requests, (SELECT COUNT(*) FROM `archive` WHERE `status`='Передано повірнику') AS metrology;";
  connection.query(countersQuery, (err, rezz) => {
    if (err) {
      console.log({
        permissionErr: err
      });
    }
		const permission = req.params.permission;
    switch (permission) {
      case '1':
        res.json({
          new_verifications: rezz[0].new_verifications,
          task_planing: rezz[0].task_planing,
          lab_requests: rezz[0].lab_requests,
        });
        break;
      case '2':
        res.json({
          new_verifications: rezz[0].new_verifications,
          lab_requests: rezz[0].lab_requests,
        });
        break;
      case '3':
        res.json({
          metrology: rezz[0].metrology,
        });
        break;
      case '4':
        res.json({
          new_verifications: rezz[0].new_verifications,
          task_planing: rezz[0].task_planing,
          lab_requests: rezz[0].lab_requests,
          metrology: rezz[0].metrology,
        });
        break;

      default:
        res.json({
          counters: 'No such permission. Dude, stop it, get some help.',
        });
        break;
    }
  });
});

router.get("/:id", (req, res, next) => {
  const queryString = "SELECT (SELECT COUNT(*)FROM `archive` WHERE `status`='Не визначено відповідальну особу' OR `status` IS NULL) AS new_verifications, (SELECT COUNT(*) FROM `archive` WHERE `status`='Визначено відповідальну особу') AS task_planing, (SELECT COUNT(*) FROM `archive` WHERE `status`='Проведено повірку на місці') AS lab_requests, (SELECT COUNT(*) FROM `archive` WHERE `status`='Передано повірнику') AS metrology;";
  connection.query(queryString, (err, result) => {
    if (err) {
      console.log({
        menuErr: err
      });
    }

    counters.new_verifications = result[0].new_verifications;
    counters.task_planing = result[0].task_planing;
    counters.lab_requests = result[0].lab_requests;
    counters.metrology = result[0].metrology;

    if (parseInt(req.params.id) > 0) {

      let menuObj = {};

      switch (req.params.id) {
        case '1':
          menuObj = getUserMenu();
          break;

        case '2':
          menuObj = getServiceProviderMenu();
          break;

        case '3':
          menuObj = getMetrologyMenu();
          break;

        case '4':
          menuObj = getAdminMenu();
          break;

        default:
          break;
      }

      res.json({
        menu: menuObj,
      });
    } else {
      res.json({
        error: 'Немає такого користувача'
      });
    }
  });
});


function getAdminMenu() {
  return [{
      title: 'Головна Панель',
      icon: 'icofont-ui-home',
      routing: 'home'
    },
    {
      title: 'Нові Повірки',
      icon: 'far fa-calendar-plus',
      routing: 'new-verifications',
      counter: counters.new_verifications
    },
    {
      title: 'Заявки Лабораторії',
      icon: 'fas fa-flask',
      routing: 'lab-requests',
      counter: counters.lab_requests
    },
    {
      title: 'Протоколи',
      icon: 'icofont-file-powerpoint',
      routing: 'verications-protocols'
    },
    {
      title: 'Електроні протоколи',
      icon: 'far fa-file-powerpoint',
      routing: 'metrology'
    },
    {
      title: 'Відхилені Протоколи',
      icon: 'fas fa-file-prescription',
      routing: 'rejected-protocols'
    },
    {
      title: 'Планування Завдання',
      icon: 'icofont-tasks-alt',
      routing: 'tasks-planing',
      counter: counters.task_planing
    },
    {
      title: 'Невиконанні завдання',
      icon: 'far fa-calendar-times',
      routing: 'failed-tasks'
    },
    {
      title: 'Завдання Для Станцій',
      icon: 'icofont-tack-pin',
      routing: 'station-tasks'
    },
    {
      title: 'Відхилені Повірки',
      icon: 'fas fa-ban',
      routing: 'rejected-verification'
    },
    {
      title: 'Архів Повірок',
      icon: 'icofont-archive',
      routing: 'verifications-archive'
    },
    {
      title: 'Звіти',
      icon: 'icofont-file-excel',
      routing: 'reports'
    }
  ];
}

function getServiceProviderMenu() {
  return [{
      title: 'Нові Повірки',
      icon: 'far fa-calendar-plus',
      routing: 'verifications',
      counter: counters.new_verifications
    },
    {
      title: 'Завершені Повірки',
      icon: 'far fa-calendar-check',
      routing: 'finished-verifications',
      counter: counters.lab_requests
    },

  ];
}

function getMetrologyMenu() {
  return [{
      title: 'Головна Панель',
      icon: 'icofont-ui-home',
      routing: 'home'
    },
    {
      title: 'Електроні Протоколи Повірок',
      icon: 'icofont-file-powerpoint',
      routing: 'verications-protocols',
      counter: counters.metrology

    },
    {
      title: 'Відхилені Протоколи',
      icon: 'icofont-file-powerpoint',
      routing: 'rejected-protocols'
    },
    {
      title: 'Архів Повірок',
      icon: 'icofont-archive',
      routing: 'verifications-archive'
    },
    {
      title: 'Звіти',
      icon: 'icofont-file-excel',
      routing: 'reports'
    }
  ];
}

function getUserMenu() {
  return [{
      title: 'Головна Панель',
      icon: 'icofont-ui-home',
      routing: 'home'
    },
    {
      title: 'Нові Повірки',
      icon: 'icofont-dashboard-web',
      routing: 'new-verifications',
      counter: counters.new_verifications
    },
    {
      title: 'Заявки Вимірювальної Лабораторії',
      icon: 'icofont-dashboard-web',
      routing: 'lab-requests',
      counter: counters.lab_requests
    },
    {
      title: 'Електроні Протоколи Повірок',
      icon: 'icofont-file-powerpoint',
      routing: 'verications-protocols'
    },
    {
      title: 'Відхилені Протоколи',
      icon: 'icofont-file-powerpoint',
      routing: 'rejected-protocols'
    },
    {
      title: 'Планування Завдання',
      icon: 'icofont-tasks-alt',
      routing: 'tasks-planing',
      counter: counters.task_planing
    },
    {
      title: 'Завдання Для Станцій',
      icon: 'icofont-tack-pin',
      routing: 'station-tasks'
    },
    {
      title: 'Відхилені Повірки',
      icon: 'icofont-archive',
      routing: 'rejected-verification'
    },
    {
      title: 'Архів Повірок',
      icon: 'icofont-archive',
      routing: 'verifications-archive'
    },
    {
      title: 'Звіти',
      icon: 'icofont-file-excel',
      routing: 'reports'
    }
  ];
}

module.exports = router;
