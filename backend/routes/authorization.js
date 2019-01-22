const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

// new_verifications, (SELECT COUNT(*) FROM `archive` WHERE `status`='Визначено відповідальну особу') AS task_planing, (SELECT COUNT(*) 
// FROM `archive` WHERE `status`='Проведено повірку на місці') AS lab_requests FROM dual;";

const counters = {
  new_verifications: 0,
  task_planing: 0,
  lab_requests: 0,
  metrology: 0
};

// Авторизація
router.get("/:id", (req, res, next) => {
  // "SELECT user_permissions FROM users WHERE user_name='" + req.body.login + "' AND user_password='" + req.body.password + "';"
  connection.query("SELECT user_permissions FROM users WHERE id ='" + req.params.id + "';", (err, user) => {
    if (err) {
      console.log(err);
    }
    const queryString = "SELECT (SELECT COUNT(*)FROM `archive` WHERE `status`='' OR `status` IS NULL) AS new_verifications, (SELECT COUNT(*) FROM `archive` WHERE `status`='Визначено відповідальну особу') AS task_planing, (SELECT COUNT(*) FROM `archive` WHERE `status`='Проведено повірку на місці') AS lab_requests, (SELECT COUNT(*) FROM `archive` WHERE `status`='Передано повірнику') AS metrology FROM dual;";
    connection.query(queryString, (err2, result) => {
      if (err2) {
        console.log(err2);
      }

      counters.new_verifications = result[0].new_verifications;
      counters.task_planing = result[0].task_planing;
      counters.lab_requests = result[0].lab_requests;
      counters.metrology = result[0].metrology;

      if (user.length > 0) {

        let menuObj = {};

        switch (user[0].user_permissions) {
          case 1:
            menuObj = getUserMenu()
						break;
						
          case 2:
            menuObj = getMetrologyMenu()
						break;
						
          case 3:
            menuObj = getAdminMenu()
						break;
						
          default:
            break;
        }
        res.json({
					menu: menuObj,
					permission: user[0].user_permissions
        });
      } else {
        res.json({
          error: 'Немає такого користувача'
        });
      }
    });
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
    },
    {
      title: 'Інструкція Користувача',
      icon: 'icofont-question-circle',
      routing: 'user-guide'
    }
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
      routing: 'verications-protocols'
    },
    {
      title: 'Відхилені Протоколи',
      icon: 'icofont-file-powerpoint',
      routing: 'rejected-protocols'
    },
    //  {
    //    title: 'Архів Повірок',
    //    icon: 'icofont-archive',
    //    routing: 'verifications-archive'
    //  },
    {
      title: 'Звіти',
      icon: 'icofont-file-excel',
      routing: 'reports'
    },
    {
      title: 'Інструкція Користувача',
      icon: 'icofont-question-circle',
      routing: 'user-guide'
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
    },
    {
      title: 'Інструкція Користувача',
      icon: 'icofont-question-circle',
      routing: 'user-guide'
    }
  ];
}

module.exports = router;
