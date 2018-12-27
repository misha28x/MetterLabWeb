const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');
const JSZip = require('jszip');
const fs = require('fs');
const SQL = require('sql.js');
const multer = require('multer')
const coder = require('base64-arraybuffer');

const connection = require('../database/db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/temp');
  },
  filename: (req, file, cb) => {
    cb(null, 'tempo.zip');
  }
});

const upload = multer({
  storage: storage
});

const router = express.Router();



function bytesToInt(bytes) {
  const startbyte = bytes.byteOffset + bytes.byteLength - Uint32Array.BYTES_PER_ELEMENT;
  const u32bytes = bytes.buffer.slice(startbyte, startbyte + Uint32Array.BYTES_PER_ELEMENT);
  return new Uint32Array(u32bytes)[0];
}

function bytesToImage(bbiFile, id) {
  let imgNum = 0;
  let imgLength = 0;

  switch (id) {
    case 0:
      imgNum = 4098;
      imgLength = (bbiFile[4098] & 255) << 8 | bbiFile[4099] & 255;
      break;
    case 1:
      imgNum = 20482;
      imgLength = (bbiFile[20482] & 255) << 8 | bbiFile[20483] & 255;
      break;
    case 2:
      imgNum = 36866;
      imgLength = (bbiFile[36866] & 255) << 8 | bbiFile[36867] & 255;
      break;
    case 3:
      imgNum = 53250;
      imgLength = (bbiFile[53250] & 255) << 8 | bbiFile[53251] & 255;
      break;
    case 4:
      imgNum = 69634;
      imgLength = (bbiFile[69634] & 255) << 8 | bbiFile[69635] & 255;
      break;
    case 5:
      imgNum = 86018;
      imgLength = (bbiFile[86018] & 255) << 8 | bbiFile[86019] & 255;
      break;
    case 6:
      imgNum = 102402;
      imgLength = (bbiFile[102402] & 255) << 8 | bbiFile[102403] & 255;
      break;
    case 7:
      imgNum = 118786;
      imgLength = (bbiFile[118786] & 255) << 8 | bbiFile[118787] & 255;
      break;
    case 8:
      imgNum = 135170;
      imgLength = (bbiFile[135170] & 255) << 8 | bbiFile[135171] & 255;
      break;
    case 9:
      imgNum = 151554;
      imgLength = (bbiFile[151554] & 255) << 8 | bbiFile[151555] & 255;
      break;
    case 10:
      imgNum = 167938;
      imgLength = (bbiFile[167938] & 255) << 8 | bbiFile[167939] & 255;
      break;
    case 11:
      imgNum = 184322;
      imgLength = (bbiFile[184322] & 255) << 8 | bbiFile[184323] & 255;
      break;
    case 12:
      imgNum = 200706;
      imgLength = (bbiFile[200706] & 255) << 8 | bbiFile[200707] & 255;
      break;

    default:
      break;
  }
  const imageBytes = bbiFile.slice(imgNum + 2, imgNum + 2 + imgLength);

  return imageBytes;
}

// Images Bytes to Base64

function getResultsFromDatabase(byteArray) {
  var db = new SQL.Database(byteArray);

  // Формуємо результат у масив об'єктів
  var test = db.prepare("SELECT * FROM Results;");
  for (var result = []; test.step();) result.push(test.getAsObject());

  for (const row of result) {
    let varData = (" VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');");
    let formatedData = varData.format(row.CounterNumber, row.Surname, row.Name, row.Middlename, row.City, row.Street, row.Building, row.Apartment, row.Account, row.Type, row.Year, row.FileNumber, row.Status, row.Date, row.RLatitude, row.RLongitude, row.Liter, row.TelNumber, row.Id_pc, row._id, row.District, row.Customer, row.Image, row.CityID, row.DistrictID, row.StreetID, row.CustomerID, row.TelNumber2, row.Note, row.serviceType);
    let varResult = ("INSERT INTO `results`(`CounterNumber`, `Surname`, `Name`, `Middlename`, `City`, `Street`," +
      " `Building`, `Apartment`, `Account`, `Type`, `Year`, `FileNumber`, `Status`, `Date`, `RLatitude`, `RLongitude`," +
      " `Liter`, `TelNumber`, `Id_pc`, `_id`, `District`, `Customer`, `Image`, `CityID`, `DistrictID`, `StreetID`," +
      " `CustomerID`, `TelNumber2`, `Note`, `serviceType`)" + formatedData);

    // TODO: count для кількості дублікатів
    connection.query(varResult, function (err, rows) {
      if (err) {
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
          console.log('Here you can handle duplication');
          return;
        } else {
          console.log('Other error in the query');
          return;
        }
      } else {
        console.log('No error in the query');
      }
    });
  }
}

function parseProtocol(byteArray, fileName) {
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
    longitude: 0,
    latitude: 0,
    protocolStatus: undefined,
    result: '',
    status: '',
    temperature: 0,
    tests: tests,
    symbol: '',
    type: '',
    year: 0
  };

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
  protocol.temperature = bytesToInt(temp);
  // Накоплений об'єм
  const liter = bbiFile.slice(96, 104);
  protocol.capacity = bytesToInt(liter);
  // Тип лічильника
  const countType = bbiFile.slice(104, 110);
  const countSymbol = bbiFile.slice(110, 116);

  for (let i = 0; i < countSymbol.length; i++) {
    if (countSymbol[i] > 127) {
      countSymbol[i] -= 128;
      if (countSymbol[i] === 74) {
        countSymbol[i] = 75;
      }
    }
  }
  // Типорозмір_лічильника
  protocol.type = uintToString(countType);

  // Умовне_позначення
  protocol.symbol = uintToString(countSymbol);

  // Рік виробництва
  const year = bbiFile.slice(124, 128);
  protocol.productionYear = bytesToInt(year);
  // Номер установки
  const deviceNumber = bbiFile.slice(68, 72);
  protocol.deviceNumber = bytesToInt(deviceNumber);

  // Широта
  const latitude = bbiFile.slice(84, 88);
  protocol.latitude = bytesToInt(latitude);
  // Довгота
  const longitude = bbiFile.slice(88, 92);
  protocol.longitude = bytesToInt(longitude);

  // Сертифікат
  const num5 = bytesToInt(bbiFile.slice(120, 124));
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
    if (bytesToInt(b2) !== 0) {
      ++num2;
      sourceIndex += 256;
    } else {
      break;
    }
  }
  // impuls / litr
  let num3 = bytesToInt(bbiFile.slice(92, 96));
  if (num3 === 0) {
    num3 = 10000;
  }
  const testId = [];
  // Заповнення масиву з тестами
  for (let index = 0; index < num2; index++) {
    const test = {
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
      startStateImage: '',
      endStateImage: ''
    };

    // index + 1 << 8
    const ind = (index + 1 << 8);

    // Заданный расход, м3/ч
    b2 = bbiFile.slice(ind, ind + 4);
    test.installedExes = (bytesToInt(b2) * 3.59999990463257 / num3);

    // Допустимая погрешность
    b2 = bbiFile.slice(ind + 12, ind + 16);
    test.assumedFault = (bytesToInt(b2) / 10);

    // Объем эталона
    b2 = bbiFile.slice(ind + 16, ind + 20);
    test.etalonCapacity = (bytesToInt(b2) / num3);

    // Начальное значение in Value
    b2 = bbiFile.slice(ind + 40, ind + 44);
    test.initValue = (bytesToInt(b2) / 10000);

    // Начальное значение, л
    const startv = (bytesToInt(b2) / 10000);

    // Конечное значение, л
    b2 = bbiFile.slice(ind + 44, ind + 48);
    test.finalValue = (bytesToInt(b2) / 10000);

    // Конечное значение in Value
    const endv = (bytesToInt(b2) / 10000);

    // Объем по счётчику, л
    test.counterCapacity = (endv - startv);

    // Продолжительность теста, с	
    b2 = bbiFile.slice(ind + 56, ind + 60);
    test.testDuration = (bytesToInt(b2) / 1000);

    // Средний расход, м3/ч	
    b2 = bbiFile.slice(ind + 64, ind + 68);
    test.mediumExes = (bytesToInt(b2) / 1000);

    // Визначення за формулою, чи входить в зону показ лічильника
    // num7 num8 result1 result2
    const result1 = (bytesToInt(b2) / 1000);
    const result2 = (bytesToInt(b2) * 3.59999990463257 / num3);
    b2 = bbiFile.slice(ind + 4, ind + 8);
    const num7 = bytesToInt(b2);
    b2 = bbiFile.slice(ind + 8, ind + 12);
    const num8 = bytesToInt(b2);

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

    test.startStateImage = coder.encode(bytesToImage(bbiFile, index * 2 + 1));
    test.endStateImage = coder.encode(bytesToImage(bbiFile, index * 2 + 2));
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

    protocol.tests.push(test);
  }

  addProtocol(protocol);
}

function uintToString(bytes) {
  const encodedString = String.fromCharCode.apply(null, bytes),
    decodedString = decodeURIComponent(escape(encodedString));
  return decodedString;
}

function addProtocol(protocol) {
  let varPart = "INSERT INTO `protocols`(`Номер_протоколу`, `Дата_та_час`, `Номер_установки`, `Системний_номер_установки`, `Номер_лічильника`,`Умовне_позначення` , `Типорозмір_лічильника`, `Призначення_лічильника`, `Температура`, `Рік_випуску`, `Накопичений_обєм`, `Широта`, `Довгота`, `Статус_витрати`, `Результат_тесту`, `Дата_підпису_протоколу`, `ПІБ_особи_підписувача`, `Статус`) ";
  let varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
  let formatedData = varData.format(protocol.bbiFileName, protocol.date, protocol.deviceNumber, null, protocol.counterNumber, protocol.symbol, protocol.type, null, protocol.temperature, protocol.productionYear, protocol.capacity, protocol.latitude, protocol.longitude, protocol.status, protocol.result, null, null, protocol.protocolStatus);

  // TODO: додати count для кількості дублікатів
  connection.query(varPart + formatedData, function (err, rows) {
    if (err) {

      if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
        console.log('Here you can handle duplication');
        return;
      } else {
        console.log('Other error in the query');
        return;
      }
    } else {
      console.log('No error in the query');
      protocol.tests.forEach(test => {
        varPart = "INSERT INTO `tests`(`Номер_протоколу`, `Назва_тесту`, `Задана_витрата`, `Обєм_еталону`, `Початкове_значення`, `Кінцеве_значення`, `Обєм_за_лічильником`, `Тривалість_тесту`, `Фактична_витрата`, `Статус_витрати`, `Допустима_похибка`, `Фактична_похибка`, `Результат_тесту`, `Початкове_зображення`, `Кінцеве_зображення`) ";
        varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
        formatedData = varData.format(test.bbiFileName, test.name, test.installedExes, test.etalonCapacity, test.initValue, test.finalValue, test.counterCapacity, test.testDuration, test.mediumExes, test.isInZone, test.assumedFault, test.calculatedFault, test.result, test.startStateImage, test.endStateImage);

        connection.query(varPart + formatedData);
      });

      connection.query("SELECT Image FROM results WHERE FileNumber='" + protocol.bbiFileName + "';", (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE `protocols` SET `Зображення`='" + coder.encode(rows[0].Image) + "' WHERE `Номер_протоколу`='" + protocol.bbiFileName + "';");
        }
      });
    }
  });
}

router.post('', upload.single('file'), (req, res, next) => {
  let zip = new JSZip();
  let db;

  fs.readFile('./backend/temp/tempo.zip', function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.forEach(async function (relativePath, zipEntry) {
        if (zipEntry.name.includes('.bbi')) {
          zip.file(zipEntry.name).async("uint8array").then(async (byteArray) => {
            await parseProtocol(byteArray, zipEntry.name.split('/')[1]);
          });
        } else if (zipEntry.name.includes('.db')) {
          zip.file("BluetoothDB.db").async("uint8array").then(async (data) => {
            await getResultsFromDatabase(data);
          });
        }
      });
    });

  });

  res.status(201);
})
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
        rt.startStateImage = testRows[i].Початкове_зображення;
        rt.endStateImage = testRows[i].Кінцеве_зображення;

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
        rp.symbol = rows[i].Умовне_позначення;
        rp.type = rows[i].Типорозмір_лічильника;
        rp.counterPurpose = rows[i].Призначення_лічильника;
        rp.temperature = rows[i].Температура;
        rp.productionYear = rows[i].Рік_випуску;
        rp.capacity = rows[i].Накопичений_обєм;
        rp.latitude = rows[i].Широта;
        rp.longitude = rows[i].Довгота;
        rp.isInZone = rows[i].Статус_витрати;
        rp.result = rows[i].Результат_тесту;
        rp.signDate = rows[i].Дата_підпису_протоколу;
        rp.signName = rows[i].ПІБ_особи_підписувача;
        rp.status = rows[i].Статус;
        rp.tests = [];

        rp.tests = testArray.filter((test) => {
          return test.bbiFileName === rp.protocolNumber;
        });

        protocolArray.push(rp);
      }
      res.status(200).send(protocolArray);
    });
  });
});

module.exports = router;
