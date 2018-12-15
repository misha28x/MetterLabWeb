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

// Вставка протоколу після отримання і завантаження файлу
router.post('', (req, res, next) => {
  let varPart = "INSERT INTO `protocols`(`Номер_протоколу`, `Дата_та_час`, `Номер_установки`, `Системний_номер_установки`, `Номер_лічильника`, `Тип_лічильника`, `Призначення_лічильника`, `Температура`, `Рік_випуску`, `Накопичений_обєм`, `Широта`, `Довгота`, `Статус_витрати`, `Результат_тесту`, `Дата_підпису_протоколу`, `ПІБ_особи_підписувача`, `Статус`) ";
  let varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
  let formatedData = varData.format(req.body.bbiFileName, req.body.date, req.body.deviceNumber, null, req.body.counterNumber, req.body.type, null, req.body.temperature, req.body.productionYear, req.body.capacity, null, null, req.body.status, req.body.result, null, null, req.body.protocolStatus);

  connection.query(varPart + formatedData);

  req.body.tests.forEach(test => {
    varPart = "INSERT INTO `tests`(`Номер_протоколу`, `Назва_тесту`, `Задана_витрата`, `Обєм_еталону`, `Початкове_значення`, `Кінцеве_значення`, `Обєм_за_лічильником`, `Тривалість_тесту`, `Фактична_витрата`, `Статус_витрати`, `Допустима_похибка`, `Фактична_похибка`, `Результат_тесту`) ";
    varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
    formatedData = varData.format(test.bbiFileName, test.name, test.installedExes, test.etalonCapacity, test.initValue, test.finalValue, test.counterCapacity, test.testDuration, test.mediumExes, test.isInZone, test.assumedFault, test.calculatedFault, test.result);

    connection.query(varPart + formatedData);
  });

  console.log('uploaded');
  // req.body - весь протокол 
  // req.body.test - тести і так далі 
});

// Отримання всіх протоколів
router.get('', (req, res, next) => {
  connection.query('SELECT * from protocols', function (err, rows, fields) {
    if (err) throw err;

    let selection = "SELECT * FROM tests";

    connection.query(selection, function (err, testRows, fields) {
      if (err) throw err;

      let testArray = [];
      let protocolArray = [];

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

        testArray.push(rt);
      }

      for (let i in rows) {
        let rp = new Object();
        rp.id = rows[i].id;
        rp.protocolNumber = rows[i].Номер_протоколу;
        rp.date = rows[i].Дата_та_час;
        rp.deviceNumber = rows[i].Номер_установки;
        rp.systemNumber = rows[i].Системний_номер_установки;
        rp.counterNumber = rows[i].Номер_лічильника;
        rp.type = rows[i].Тип_лічильника;
        rp.counterPurpose = rows[i].Призначення_лічильника;
        rp.temperature = rows[i].Температура;
        rp.productionYear = rows[i].Рік_випуску;
        rp.capacity = rows[i].Накопичений_обєм;
        rp.width = rows[i].Широта;
        rp.height = rows[i].Довгота;
        rp.isInZone = rows[i].Статус_витрати;
        rp.result = rows[i].Результат_тесту;
        rp.signDate = rows[i].Дата_підпису_протоколу;
        rp.signName = rows[i].ПІБ_особи_підписувача;
        rp.status = rows[i].Статус;
        rp.tests = [];

        rp.tests = testArray.filter((test) => {
          return test.bbiFileName === rp.protocolNumber;
        });

        console.log(rp);
        protocolArray.push(rp);
      }
      res.status(200).send(protocolArray);
    });
  });
});

// Отримання протоколу за номером
router.get('/:id', (req, res, next) => {
  let selectionOne = "SELECT * FROM protocols WHERE Номер_протоколу = '" + req.params.id + "';";

  connection.query(selectionOne, function (err, rows, fields) {
    if (err) throw err;

    let selection = "SELECT * FROM tests";

    connection.query(selection, function (err, testRows, fields) {
      if (err) throw err;

      let testArray = [];
      let protocolArray = [];

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

        testArray.push(rt);
      }
      let rp = new Object();
      rp.id = rows[0].id;
      rp.protocolNumber = rows[0].Номер_протоколу;
      rp.date = rows[0].Дата_та_час;
      rp.deviceNumber = rows[0].Номер_установки;
      rp.systemNumber = rows[0].Системний_номер_установки;
      rp.counterNumber = rows[0].Номер_лічильника;
      rp.type = rows[0].Тип_лічильника;
      rp.counterPurpose = rows[0].Призначення_лічильника;
      rp.temperature = rows[0].Температура;
      rp.productionYear = rows[0].Рік_випуску;
      rp.capacity = rows[0].Накопичений_обєм;
      rp.width = rows[0].Широта;
      rp.height = rows[0].Довгота;
      rp.isInZone = rows[0].Статус_витрати;
      rp.result = rows[0].Результат_тесту;
      rp.signDate = rows[0].Дата_підпису_протоколу;
      rp.signName = rows[0].ПІБ_особи_підписувача;
      rp.status = rows[0].Статус;
      rp.tests = [];

      rp.tests = testArray.filter((test) => {
        return test.bbiFileName === rp.protocolNumber;
      });

      console.log(rp);
      protocolArray.push(rp);

      res.status(200).send(protocolArray);
    });
  });
});

// Оновлення протоколу
router.put('', (req, res, next) => {
	
	// ! Передається все крім id і Номер_протококу !
  let varData = "`Дата_та_час`='%s',`Номер_установки`='%s',`Системний_номер_установки`='%s',`Номер_лічильника`='%s',`Тип_лічильника`='%s',`Призначення_лічильника`='%s',`Температура`='%s',`Рік_випуску`='%s',`Накопичений_обєм`='%s',`Широта`='%s',`Довгота`='%s',`Статус_витрати`='%s',`Результат_тесту`='%s',`Дата_підпису_протоколу`='%s',`ПІБ_особи_підписувача`='%s',`Статус`='%s'";
	let formatedData = varData.format(req.body.date, req.body.deviceNumber, null, req.body.counterNumber, req.body.type, null, req.body.temperature, req.body.productionYear, req.body.capacity, null, null, req.body.status, req.body.result, null, null, req.body.protocolStatus);
	let varResult = "UPDATE protocols SET " + formatedData + " WHERE Номер_протоколу = '" + req.params.id + "';";

  connection.query(varResult);

	// ! Передається все крім id, Номер_протоколу, Назва_тесту !
  req.body.tests.forEach(test => {

		let varData = "`Задана_витрата`='%s',`Обєм_еталону`='%s',`Початкове_значення`='%s',`Кінцеве_значення`='%s',`Обєм_за_лічильником`='%s',`Тривалість_тесту`='%s',`Фактична_витрата`='%s',`Статус_витрати`='%s',`Допустима_похибка`='%s',`Фактична_похибка`='%s',`Результат_тесту`='%s'";
		let formatedData = varData.format(test.installedExes, test.etalonCapacity, test.initValue, test.finalValue, test.counterCapacity, test.testDuration, test.mediumExes, test.isInZone, test.assumedFault, test.calculatedFault, test.result);
		let varResult = "UPDATE tests SET " + formatedData + " WHERE Номер_протоколу = '" + req.params.id + "' AND Назва_тесту = '" + test.name + "';";
   
    connection.query(varResult);
  });

  console.log('uploaded');
  // req.body - весь протокол 
  // req.body.test - тести і так далі 
});

module.exports = router;
