const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

function createMenu(newV, labR, proR, tasP) {

  return [{
      title: 'Головна Панель',
      icon: 'icofont-ui-home',
      routing: 'home'
    },
    {
      title: 'Нові Повірки',
      icon: 'icofont-dashboard-web',
      routing: 'new-verifications',
      counter: newV
    },
    {
      title: 'Заявки Вимірювальної Лабораторії',
      icon: 'icofont-dashboard-web',
      routing: 'lab-requests',
      counter: labR
    },
    {
      title: 'Заявки Для Надавача Послуг',
      icon: 'icofont-dashboard-web',
      routing: 'provides-requests',
      counter: proR
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
      counter: tasP
    },
    {
      title: 'Завдання Для Станцій',
      icon: 'icofont-tack-pin',
      routing: 'station-tasks'
    },
    {
      title: 'Завдання Для Бригад',
      icon: 'icofont-tack-pin',
      routing: 'brigade-tasks'
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

const queryString = "SELECT (SELECT COUNT(*)FROM new_verifications) AS new_verifications,(SELECT COUNT(*) FROM 	lab_requests) AS lab_requests, (SELECT COUNT(*) FROM 	provides_requests) AS provides_requests, (SELECT COUNT(*) FROM 	task_planing) AS task_planing FROM dual;";

router.get('', (req, res, next) => {
  connection.query(queryString, (err, result) => {
    if (err) {
      console.log(err);
		}
		const menu = createMenu(result[0].new_verifications, result[0].lab_requests, result[0].provides_requests, result[0].task_planing);
    res.status(200).json(menu);
  });
});

module.exports = router;
