const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'water_counters',
  user: 'root',
  password: '',
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

      rp.tests = testArray;

      console.log(rp);

      res.status(200).send(rp);
    });
  });
});

// Оновлення протоколу
router.put('/:id', (req, res, next) => {

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

  console.log('updated');
  res.status(200);
});

function upload(files) {
  // let fileCounter = 0;
  const reader = new FileReader();
  let progress;
  let fileName;

  reader.onload = () => {
    const tests = [];

    const protocol = {
      bbiFileName: '',
      capacity: 0,
      counterNumber: '',
      date: new Date(),
      day: 0,
      deviceNumber: 0,
      hours: 0,
      minutes: 0,
      month: 0,
      productionYear: 0,
      protocolStatus: undefined,
      result: '',
      status: '',
      temperature: 0,
      tests: tests,
      type: '',
      year: 0
    };

    const byteArray = reader.result;
    const bbiFile = new Uint8Array(byteArray);
    // Дата
    protocol.bbiFileName = fileName;
    protocol.day = bbiFile[0];
    protocol.month = bbiFile[1];
    protocol.year = (bbiFile[2] | bbiFile[3] << 8);
    protocol.hours = bbiFile[4];
    protocol.minutes = bbiFile[5];

    // Дата
    const date = new Date((bbiFile[2] | bbiFile[3] << 8), bbiFile[1], bbiFile[0], bbiFile[4], bbiFile[5]);
    protocol.date = date;

    // Номер счётчика
    const counter = bbiFile.slice(72, 84);
    let protocolCounter;
    for (let i = 0; i < counter.byteLength; i++) {
      protocolCounter += String.fromCharCode(counter[i]);
    }
    const ppss = protocolCounter.replace(/[^-0-9]/gim, '');
    protocol.counterNumber = ppss;
    // Температура
    const temp = bbiFile.slice(20, 24);
    protocol.temperature = this.bytesToInt(temp);
    // Накоплений об'єм
    const liter = bbiFile.slice(96, 104);
    protocol.capacity = this.bytesToInt(liter);
    // Тип лічильника
    const countType = bbiFile.slice(104, 110);
    const countType2 = bbiFile.slice(112, 116);
    protocol.type = this.uintToString(countType) + 'КВ' + this.uintToString(countType2);
    // Рік виробництва
    const year = bbiFile.slice(124, 128);
    protocol.productionYear = this.bytesToInt(year);
    // Номер установки
    const deviceNumber = bbiFile.slice(68, 72);
    protocol.deviceNumber = this.bytesToInt(deviceNumber);

    /*
    // Широта
    const lat = bbiFile.slice(84, 88);
    console.log('Широта: ' + this.bytesToInt(lat) / 100000);
    // Довгота
    const long = bbiFile.slice(88, 92);
    console.log('Довгота: ' + this.bytesToInt(long) / 100000);
    */

    // Сертифікат
    const num5 = this.bytesToInt(bbiFile.slice(120, 124));
    if (num5 === 0) {
      protocol.protocolStatus = (true);
      protocol.status = 'Разблокирован';
    } else {
      protocol.protocolStatus = (false);
      protocol.status = 'Заблокирован';
    }

    // Тести
    let num2 = 0;
    let b2;
    // Перевіряємо, скільки тестів міститься в файлі
    let sourceIndex = 312;
    while (sourceIndex < 1792) {
      b2 = bbiFile.slice(sourceIndex, sourceIndex + 4);
      if (this.bytesToInt(b2) !== 0) {
        ++num2;
        sourceIndex += 256;
      } else {
        break;
      }
    }

    // impuls / litr
    let num3 = this.bytesToInt(bbiFile.slice(92, 96));
    if (num3 === 0) {
      num3 = 10000;
    }

    const testId = new Array;
    // Заповнення масиву з тестами
    for (let index = 0; index < num2; index++) {
      const test: Test = {
        bbiFileName: fileName,
        name: '',
        installedExes: 0,
        assumedFault: 0,
        etalonCapacity: 0,
        initValue: 0,
        finalValue: 0,
        counterCapacity: 0,
        testDuration: 0,
        mediumExes: 0,
        isInZone: '',
        calculatedFault: 0,
        result: '',
        startStateImage: null,
        endStateImage: null
      };

      // index + 1 << 8
      const ind = (index + 1 << 8);

      // Заданный расход, м3/ч
      b2 = bbiFile.slice(ind, ind + 4);
      test.installedExes = (this.bytesToInt(b2) * 3.59999990463257 / num3);

      // Допустимая погрешность
      b2 = bbiFile.slice(ind + 12, ind + 16);
      test.assumedFault = (this.bytesToInt(b2) / 10);

      // Объем эталона
      b2 = bbiFile.slice(ind + 16, ind + 20);
      test.etalonCapacity = (this.bytesToInt(b2) / num3);

      // Начальное значение in Value
      b2 = bbiFile.slice(ind + 40, ind + 44);
      test.initValue = (this.bytesToInt(b2) / 10000);

      // Начальное значение, л
      const startv = (this.bytesToInt(b2) / 10000);

      // Конечное значение, л
      b2 = bbiFile.slice(ind + 44, ind + 48);
      test.finalValue = (this.bytesToInt(b2) / 10000);

      // Конечное значение in Value
      const endv = (this.bytesToInt(b2) / 10000);

      // Объем по счётчику, л
      test.counterCapacity = (endv - startv);

      // Продолжительность теста, с	
      b2 = bbiFile.slice(ind + 56, ind + 60);
      test.testDuration = (this.bytesToInt(b2) / 1000);

      // Средний расход, м3/ч	
      b2 = bbiFile.slice(ind + 64, ind + 68);
      test.mediumExes = (this.bytesToInt(b2) / 1000);

      // Визначення за формулою, чи входить в зону показ лічильника
      // num7 num8 result1 result2
      const result1 = (this.bytesToInt(b2) / 1000);
      const result2 = (this.bytesToInt(b2) * 3.59999990463257 / num3);
      b2 = bbiFile.slice(ind + 4, ind + 8);
      const num7 = this.bytesToInt(b2);
      b2 = bbiFile.slice(ind + 8, ind + 12);
      const num8 = this.bytesToInt(b2);

      if ((result2 - result2 * num7 / 100.0 <= result1) && (result2 + result2 * num8 / 100.0 >= result1)) {
        test.isInZone = 'Не в зоні';
      } else {
        test.isInZone = 'В зоні';
      }
      // Обробка поля результатів тесту
      if (test.initValue !== 0 && test.finalValue !== 0) {
        const differ = test.counterCapacity - test.etalonCapacity;
        test.calculatedFault = (differ * 100 / test.etalonCapacity);
      } else {
        test.calculatedFault = 0;
      }

      // Перевірка за Начальное значение і Конечное значение
      const result1finalValue = test.finalValue;
      const result2initValue = test.initValue;

      if (result1finalValue === 0.0) {
        if (result1finalValue === 0.0 && result2initValue === 0.0) {
          test.result = 'Не обработан';
        } else if (result2initValue > result1finalValue) {
          test.result = 'Не обработан';
        } else if (result2initValue === result1finalValue) {
          test.result = 'Не годен';
        }
      } else {
        const result1calculatedFault = test.calculatedFault;
        const result2assumedFault = test.assumedFault;

        if (result2assumedFault >= Math.abs(result1calculatedFault)) {
          test.result = 'Годен';
        } else {
          test.result = 'Не годен';
        }
      }
      // TODO: невикористовувана зміна
      let testIdCount = 0.0;

      testId[index] = (bbiFile[(index + 1 << 8) + 72]);
      // Підрахунок кількості тестів
      if ((testId[index] % 10.0) === 0) {
        ++testIdCount;
      }

      //  GetImage(bbiFile, 0).Save(@"C:\file\image0.jpeg", ImageFormat.Jpeg);
      test.startStateImage = this.bytesToImage(bbiFile, index * 2 + 1).toString();
      test.endStateImage = this.bytesToImage(bbiFile, index * 2 + 2).toString();

      // Протокол "Не обработан" чи "Годен" чи "Не Годен"
      if (test.result === 'Не обработан') {
        protocol.result = 'Не обработан';
      } else if (test.result === 'Годен') {
        protocol.result = 'Годен';
      } else if (test.result === 'Не годен') {
        protocol.result = 'Не годен';
      }

      // Протокол "В зоні" чи "Не в зоні"
      if (test.isInZone === 'В зоне') {
        protocol.status = 'В зоне';
      } else if (test.isInZone === 'Не в зоне') {
        protocol.status = 'Не в зоне';
      }

      // Встановлення імені тесту
      const testNameNumber = Math.round(testId[index] / 10);
      const testNameSubNumber = Math.round(testId[index] % 10);

      if (testNameSubNumber === 0) {
        test.name = 'Тест ' + testNameNumber;
      } else {
        test.name = 'Тест ' + testNameNumber + ' Повтор ' + testNameSubNumber;
      }

      // Додавання протоколу
      protocol.tests.push(test);
    }
  }
}

module.exports = router;
