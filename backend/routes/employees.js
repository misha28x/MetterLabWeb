const express = require('express');
const mysql = require('mysql');

const connection = require('../database/db');

const router = express.Router();

/**
 * Даний роут вибирає рядки з таблиці users за полем serviceProvider
 * @param req.params.provider - назва провайдера
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
router.get("/user/:id", (req, res, next) => {
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
 * @param req.body.serviceProvider - Назва організації
 */
router.post("/users", (req, res, next) => {
  connection.query("INSERT INTO `users`(`user_name`, `user_password`, `user_permissions`, `user_full_name`, `service_provider`) " +
    " VALUES ('" + req.body.name + "','" + req.body.password + "','" + req.body.permissions + "','" + req.body.full + "','" + req.body.serviceProvider + "');", (err) => {
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
  let formatedData = varData.format(req.body.name, req.body.password, req.body.permissions, req.body.full, req.body.serviceProvider);
  let varResult = "UPDATE users SET " + formatedData + " WHERE id = '" + req.params.id + "';";
  connection.query(varResult, (err) => {
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
router.get("/stations/:serviceProvider", (req, res, next) => {
  connection.query("SELECT * FROM `stations` WHERE serviceProvider ='" + req.params.serviceProvider + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});

/**
 * Базові CRUD операції для роботи з stations
 * @param req.params.number - номер станції в базі даних
 */
router.get("/station/:number", (req, res, next) => {
  connection.query("SELECT * FROM `stations` WHERE stationNumber = '" + req.params.number + "';", (err, result) => {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

/**
 * Додавання нової станції
 * @param req.body.stationNumber - Номер станції
 * @param req.body.employeeName - Ім'я користувача
 * @param req.body.phoneNumber - Номер телефону
 * @param req.body.contactEmail - EMail
 * @param req.body.serviceProvider - Назва організації
 */
router.post("/stations", (req, res, next) => {
  connection.query("INSERT INTO `stations`(`stationNumber`, `employeeName`, `phoneNumber`, `contactEmail`, `serviceProvider`) " +
    " VALUES ('" + req.body.stationNumber + "','" + req.body.employeeName + "','" + req.body.phoneNumber + "','" + req.body.contactEmail + "','" + req.body.serviceProvider + "');", (err) => {
      if (err) {
        console.log(err);
      }
      res.status(200).send({
        msg: 'Додано нову станцію'
      });
    });
});

/**
 * Оновлення інформації про станцію 
 * @param req.body. - оновлені дані
 * @param req.params.number - ідентифікатор оновлюваної станції
 */
router.put("/stations/:number", (req, res, next) => {
  let varData = "`stationNumber`='%s',`employeeName`='%s',`phoneNumber`='%s',`contactEmail`='%s',`serviceProvider`='%s'";
  let formatedData = varData.format(req.body.stationNumber, req.body.employeeName, req.body.phoneNumber, req.body.contactEmail, req.body.serviceProvider);
  let varResult = "UPDATE stations SET " + formatedData + " WHERE stationNumber = '" + req.params.number + "';";
  connection.query(varResult, (err) => {
    if (err) {
      console.log(err);
    }
    res.status(201).send({
      msg: 'Дані про станцію були оновлені'
    });
  });
});

/**
 * Видалення станції
 * @param req.params.number - номер станції, яку потрібно видалити
 */
router.delete("/stations/:number", (req, res, next) => {
  connection.query("DELETE FROM stations WHERE stationNumber='" + req.params.number + "';", (err) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      msg: 'Станцію видалено'
    });
  });
});

/**
 * Отримання списку рівнів доступу
 * 
 * @returns список рівнів доступу id, value;
 */
router.get("/permissions", (req, res, next) => {
  connection.query("SELECT * FROM permissions;", (err, result) => {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

/**
 * Отримання списку всіх міст
 * 
 * @returns список всіх міст (cap)
 */
router.get("/city", (req, res, next) => {
  connection.query("SELECT * FROM `city`;", (err, result) => {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

/**
 * Базові CRUD операції для роботи з city
 * @param req.params.id - id міста в базі даних
 */
router.get("/city/:id", (req, res, next) => {
  connection.query("SELECT * FROM `city` WHERE id = '" + req.params.id + "';", (err, result) => {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

/**
 * Додавання нового міста
 * @param req.body.name - Назва міста
 */
router.post("/city", (req, res, next) => {
  connection.query("INSERT INTO `city`(`name`) " +
    " VALUES ('" + req.body.name + "');", (err) => {
      if (err) {
        console.log(err);
      }
      res.status(200).send({
        msg: 'Додано нове місто'
      });
    });
});

/**
 * Оновлення інформації про місто 
 * @param req.body.name - назва міста
 * @param req.params.id - ідентифікатор оновлюваного міста
 */
router.put("/city/:id", (req, res, next) => {
  let varData = "`name`='%s'";
  let formatedData = varData.format(req.body.name);
  let varResult = "UPDATE city SET " + formatedData + " WHERE id = '" + req.params.id + "';";
  connection.query(varResult, (err) => {
    if (err) {
      console.log(err);
    }
    res.status(201).send({
      msg: 'Дані про місто були оновлені'
    });
  });
});

/**
 * Видалення міста
 * @param req.params.id - id міста, яке потрібно видалити
 */
router.delete("/city/:id", (req, res, next) => {
  connection.query("DELETE FROM city WHERE id='" + req.params.id + "';", (err) => {
    console.log(req.params.id);
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      msg: 'Місто видалено'
    });
  });
});

/**
 * Отримання списку всіх підприємств
 * 
 * @returns список всіх contractors
 */
router.get("/contractors", (req, res, next) => {
  connection.query("SELECT * FROM `contractors`;", (err, result) => {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

/**
 * Базові CRUD операції для роботи з contractors
 * @param req.params.id - id підприємства в базі даних
 */
router.get("/contractors/:id", (req, res, next) => {
  connection.query("SELECT * FROM `contractors` WHERE id = '" + req.params.id + "';", (err, result) => {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

/**
 * Додавання нового підприємства
 * @param req.body.name - Назва міста
 * @param req.body.city_id - Ідентифікатор міста
 * @param req.body.permission - Тип підприємства
 */
router.post("/contractors", (req, res, next) => {
  connection.query("INSERT INTO `contractors`(`name`, `city_id`, `permission`) " +
    " VALUES ('" + req.body.name + "', '" + req.body.city_id + "', '" + req.body.permission + "');", (err) => {
      if (err) {
        console.log(err);
      }
      res.status(200).send({
        msg: 'Додано нове підприємство'
      });
    });
});

/**
 * Оновлення інформації про підприємство 
 * @param req.body.name - назва підприємства
 * @param req.body.city_id - Ідентифікатор міста 
 * @param req.body.permission - Тип підприємства
 * @param req.params.id - ідентифікатор оновлюваного підприємства
 */
router.put("/contractors/:id", (req, res, next) => {
  let varData = "`name`='%s', `city_id`='%s', `permission`='%s'";
  let formatedData = varData.format(req.body.name, req.body.city_id, req.body.permission);
  let varResult = "UPDATE contractors SET " + formatedData + " WHERE id = '" + req.params.id + "';";
  connection.query(varResult, (err) => {
    if (err) {
      console.log(err);
    }
    res.status(201).send({
      msg: 'Дані про підприємство були оновлені'
    });
  });
});

/**
 * Видалення підприємства
 * @param req.params.id - id підприємства, яке потрібно видалити
 */
router.delete("/contractors/:id", (req, res, next) => {
  connection.query("DELETE FROM contractors WHERE id='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      msg: 'Підприємство видалено'
    });
  });
});

module.exports = router;
