const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const connection = require('../database/db');
// TODO: видалити табличку verications-protocols
router.get('', (req, res, next) => {
  connection.query('SELECT * FROM results', (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log('success');
    res.status(200).json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let selectionOne = "SELECT * FROM protocols WHERE Номер_протоколу = '" + req.params.id + "';";

  connection.query(selectionOne, function (err, rows, fields) {
    if (err) throw err;

    let selection = "SELECT * FROM tests WHERE Номер_протоколу = '" + req.params.id + "';";

    connection.query(selection, function (err, testRows, fields) {
      if (err) throw err;
    
      let testArray = [];

      for (let i in testRows) {
        let rt = new Object();
        rt.id = testRows[i].id;
        rt.bbiFileName = testRows[i].Номер_протоколу;
        rt.name = testRows[i].Назва_тесту;
        rt.installedExes = testRows[i].Задана_витрата;
        rt.etalonCapacity = testRows[i].Обєм_еталону;
        rt.initValue = testRows[i].Початкове_значення;
        rt.finalValue = testRows[i].Кінцеве_значення;
        rt.counterCapacity = testRows[i].Обєм_за_лічильником;
        rt.testDuration = testRows[i].Тривалість_тесту;
        rt.mediumExes = testRows[i].Фактична_витрата;
        rt.isInZone = testRows[i].Статус_витрати;
        rt.assumedFault = testRows[i].Допустима_похибка;
        rt.calculatedFault = testRows[i].Фактична_похибка;
        rt.result = testRows[i].Результат_тесту;
        rt.startStateImage = testRows[i].Початкове_зображення;
        rt.endStateImage = testRows[i].Кінцеве_зображення;

        testArray.push(rt);
      }

      let rp = new Object();
      rp.id = rows[0].id;
      rp.protocolNumber = rows[0].Номер_протоколу;
      rp.date = rows[0].Дата_та_час;
      rp.deviceNumber = rows[0].Номер_установки;
      rp.systemNumber = rows[0].Системний_номер_установки;
      rp.counterNumber = rows[0].Номер_лічильника;
      rp.symbol = rows[0].Умовне_позначення;
      rp.type = rows[0].Типорозмір_лічильника;
      rp.counterPurpose = rows[0].Призначення_лічильника;
      rp.temperature = rows[0].Температура;
      rp.productionYear = rows[0].Рік_випуску;
      rp.capacity = rows[0].Накопичений_обєм;
      rp.latitude = rows[0].Широта;
      rp.longitude = rows[0].Довгота;
      rp.isInZone = rows[0].Статус_витрати;
      rp.result = rows[0].Результат_тесту;
      rp.signDate = rows[0].Дата_підпису_протоколу;
      rp.signName = rows[0].ПІБ_особи_підписувача;
      rp.status = rows[0].Статус;
      rp.tests = [];

      rp.tests = testArray;

      res.status(200).send(rp);
    });
  });
});

// Оновлення протоколу
router.put('/:id', (req, res, next) => {
  // ! Передається все крім id і Номер_протококу !
  let varData = "`Дата_та_час`='%s',`Номер_установки`='%s',`Системний_номер_установки`='%s',`Номер_лічильника`='%s', `Умовне_позначення`='%s' ,`Типорозмір_лічильника`='%s',`Призначення_лічильника`='%s',`Температура`='%s',`Рік_випуску`='%s',`Накопичений_обєм`='%s',`Широта`='%s',`Довгота`='%s',`Статус_витрати`='%s',`Результат_тесту`='%s',`Дата_підпису_протоколу`='%s',`ПІБ_особи_підписувача`='%s',`Статус`='%s'";
  let formatedData = varData.format(req.body.date, req.body.deviceNumber, null, req.body.counterNumber, req.body.symbol, req.body.type, null, req.body.temperature, req.body.productionYear, req.body.capacity, req.body.latitude, req.body.longitude, req.body.status, req.body.result, null, null, req.body.protocolStatus);
  let varResult = "UPDATE protocols SET " + formatedData + " WHERE Номер_протоколу = '" + req.params.id + "';";

  connection.query(varResult);
  // ! Передається все крім id, Номер_протоколу, Назва_тесту !
  req.body.tests.forEach(test => {

    let varData = "`Задана_витрата`='%s',`Обєм_еталону`='%s',`Початкове_значення`='%s',`Кінцеве_значення`='%s',`Обєм_за_лічильником`='%s',`Тривалість_тесту`='%s',`Фактична_витрата`='%s',`Статус_витрати`='%s',`Допустима_похибка`='%s',`Фактична_похибка`='%s',`Результат_тесту`='%s',`Початкове_зображення`='%s',`Кінцеве_зображення`='%s'";
    let formatedData = varData.format(test.installedExes, test.etalonCapacity, test.initValue, test.finalValue, test.counterCapacity, test.testDuration, test.mediumExes, test.isInZone, test.assumedFault, test.calculatedFault, test.result, test.startStateImage, test.endStateImage);
    let varResult = "UPDATE tests SET " + formatedData + " WHERE Номер_протоколу = '" + req.params.id + "' AND Назва_тесту = '" + test.name + "';";

    connection.query(varResult);
  });

  res.status(200);
});

module.exports = router;
