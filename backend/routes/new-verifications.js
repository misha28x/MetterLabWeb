const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'water_counters',
  user: 'root',
  password: 'root',
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// 1) Запит для отримання усіх повірок get
router.get('', (req, res, next) => {
  con.query('SELECT * FROM new_verifications', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});
// 2) Додавання нової повірки post
router.post('', (req, res, next) => {
  let varData = (" VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');");
  let formatedData = varData.format( /** змінні для запиту */ );
  let varResult = ("INSERT INTO `new_verifications`(`Номер_заявки`, `Дата_надходження`, `Клієнт`, `Надавач_послуг`," +
    " `Район`, `Вулиця`, `Будинок`, `Квартира`, `Бажана_дата_повірки`, `Бажаний_час_повірки`, `Cправність_сантехніки`," +
    " `Вода_відсутня_до`, `Наявність_пломби`, `Телефон`, `Примітка`)" + formatedData);

  connection.query(varResult, () => {
    res.status(201);
  });
});

// 3) Редагуваня повірки put
router.put('/:id', (req, res, next) => {
  let varData = "`Номер_заявки`='%s',`Дата_надходження`='%s',`Клієнт`='%s',`Надавач_послуг`='%s',`Район`='%s'," +
    "`Вулиця`='%s',`Будинок`='%s',`Квартира`='%s',`Бажана_дата_повірки`='%s',`Бажаний_час_повірки`='%s', " +
    " `Cправність_сантехніки`='%s',`Вода_відсутня_до`='%s',`Наявність_пломби`='%s',`Телефон`='%s',`Примітка`='%s'";
  let formatedData = varData.format( /** змінні для запиту */ );
  let varResult = "UPDATE new_verifications SET " + formatedData + " WHERE Номер_заявки = '" + req.params.id +"';";;

  connection.query(varResult, () => {
    res.status(200);
  });
});

// 4) Видалення повірки delete
router.delete('/:id', (req, res, next) => {
	let query = "DELETE FROM `new_verifications` WHERE `Номер_заявки`='" + req.params.id +"';";

  connection.query(query, () => {
    res.status(200);
  });
});

module.exports = router;
