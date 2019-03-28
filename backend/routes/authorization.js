const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');

const counters = {
  new_verifications: 0,
  task_planing: 0,
  lab_requests: 0,
  metrology: 0
};

// Авторизація
router.post("", (req, res, next) => {
  connection.query("SELECT * FROM users WHERE 	user_name ='" + req.body.email + "' AND user_password='" + req.body.pass + "';", (err, user) => {
    if (err) {
      console.log(err);
      res.json({
        error: 'Помилка авторизації'
      });
    } 

    if (user) {
      res.json({
        permission: user[0].user_permissions,
        username: user[0].user_full_name,
        serviceProvider: user[0].service_provider,
      });
    } else {
      console.log( user );
      res.json({
        error: 'Немає такого користувача'
      });
    }
  });
});


module.exports = router;
