const express = require('express');
const mysql = require('mysql');

const connection = require('../database/db');

const router = express.Router();

/**
 * Даний роут вибирає рядки з таблиці users за полем serviceProvider
 * @param req.body.serviceProvider - назва провайдера
 * 
 * @returns result - результат вибірки за запитом
 */
router.get("/users/:provider", (req, res, next) => {
  connection.query("SELECT * FROM `users` WHERE service_provider = '" + req.params.provider + "';", (err, result) => {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

/**
 * Базові CRUD операції для роботи з users
 * @param req.params.id - ідентифікатор користувача в базі даних
 */
router.get("/users/:id", (req, res, next) => {
  connection.query("SELECT * FROM users WHERE id = '" + req.params.id + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    
    res.json(result);
  });
});

/**
 * Додавання нового користувача
 * @param req.body.name - Ім 'я користувача
 * @param req.body.password - Пароль користувача
 * @param req.body.permissions - Рівень доступу
 * @param req.body.full - ПІБ
 * @param req.body.provider - Назва організації
 */
router.post("/users", (req, res, next) => {
  connection.query("INSERT INTO `users`(`user_name`, `user_password`, `user_permissions`, `user_full_name`, `service_provider`) " +
    " VALUES ('" + req.body.name + "','" + req.body.password + "','" + req.body.permissions + "','" + req.body.full + "','" + req.body.provider + "');", (err) => {
      if (err) {
        console.log(err);
      }
      res.status(200).send({
        msg: 'Додано нового користувача'
      });
    });
});

/**
 * Оновлення інформації про користувача 
 * @param req.body. - оновлені дані
 * @param req.params.id - ідентифікатор оновлюваного користувача
 */
router.put("/users/:id", (req, res, next) => {
  let varData = "`user_name`='%s',`user_password`='%s',`user_permissions`='%s',`user_full_name`='%s',`service_provider`='%s'";
  let formatedData = varData.format(req.body.name, req.body.password, req.body.permissions, req.body.full, req.body.provider);
  let varResult = "UPDATE users SET " + formatedData + " WHERE id = '" + req.params.id + "';";
  connection.query("", (err) => {
    if (err) {
      console.log(err);
    }
    res.status(201).send({
      msg: 'Дані користувача були оновлені'
    });
  });
});

/**
 * Видалення користувача
 * @param req.params.id - ідентифікатор користувача, якого потрібно видалити
 */
router.delete("/users/:id", (req, res, next) => {
  connection.query("DELETE FROM users WHERE id='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      msg: 'Профіль користувача було видалено'
    });
  });
});

/**
 * Отримання станцій для окремого підприємства
 * @param req.body.serviceProvider - назва підприємства
 * 
 * @returns Вибірку даних за назвою:
 * stationNumber, employeeName, phoneNumber, contactEmail, serviceProvider
 */
router.get("/stations", (req, res, next) => {
  connection.query("SELECT * FROM `stations` WHERE serviceProvider ='" + req.body.serviceProvider + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});

module.exports = router;
