const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');
const JSZip = require('jszip');
const fs = require('fs');
const SQL = require('sql.js');
const multer = require('multer')
const coder = require('base64-arraybuffer');
const connection = require('../database/db');
const io = require('../socket/socket');

const bytesToImage = require('../utils/utils').bytesToImage;
const createNextApplicationNumber = require('../utils/utils').createNextApplicationNumber;

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

const uploadInfo = {
  counter: 0,
  errors: []
};

function bytesToInt(bytes) {
  const startbyte = bytes.byteOffset + bytes.byteLength - Uint32Array.BYTES_PER_ELEMENT;
  const u32bytes = bytes.buffer.slice(startbyte, startbyte + Uint32Array.BYTES_PER_ELEMENT);
  return new Uint32Array(u32bytes)[0];
}

function getResultsFromDatabase(byteArray) {
  const db = new SQL.Database(byteArray);

  // Формуємо результат у масив об'єктів
  const test = db.prepare("SELECT * FROM Results;");
  let result;
  for (result = []; test.step();) {
    result.push(test.getAsObject());
  }

  const unformatedDate = result[0].Date.split(' ')[0].split('.');
  const date = unformatedDate[2] + '-' + unformatedDate[1] + '-' + unformatedDate[0];
  console.log({
    'Uploading. Task date': date
  });

  connection.query("SELECT `applicationNumber` FROM `archive` WHERE `addingDate`='" + date + "' ORDER BY `applicationNumber` DESC LIMIT 1;", (err, lastNumber) => {
    if (err) {
      console.log(err);
      return;
    }
    let applicationNumber = '';
    if (lastNumber.length > 0 && lastNumber[0]) {
      applicationNumber = lastNumber[0].applicationNumber;
    } else {
      const oldDateFormat = date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0];
      applicationNumber = createApplicationNumber(applicationNumber, oldDateFormat);
      console.log({
        "Перший запис за день": applicationNumber
      });
    }

    for (const row of result) {
      if (row.CounterNumber.length < 4 | row.CounterNumber == '-' | row.FileNumber == '00000000.bbi') {
        continue;
      }

      connection.query("SELECT `applicationNumber`, `idForStation` FROM `archive` WHERE `applicationNumber` ='" + row.Id_pc + "';", (err, appNum) => {

        let varData = (" VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');");
        let formatedData = varData.format(row.CounterNumber, row.Surname, row.Name, row.Middlename, row.City, row.Street, row.Building, row.Apartment, row.Account, row.Type, row.Year, row.FileNumber, row.Status, row.Date, row.RLatitude, row.RLongitude, row.Liter, row.TelNumber, row.Id_pc, row._id, row.District, row.Customer, row.Image, row.CityID, row.DistrictID, row.StreetID, row.CustomerID, row.TelNumber2, row.Note, row.serviceType);
        let varResult = ("INSERT INTO `results`(`CounterNumber`, `Surname`, `Name`, `Middlename`, `City`, `Street`," +
          " `Building`, `Apartment`, `Account`, `Type`, `Year`, `FileNumber`, `Status`, `Date`, `RLatitude`, `RLongitude`," +
          " `Liter`, `TelNumber`, `Id_pc`, `_id`, `District`, `Customer`, `Image`, `CityID`, `DistrictID`, `StreetID`," +
          " `CustomerID`, `TelNumber2`, `Note`, `serviceType`)" + formatedData);

        connection.query(varResult, function (err, rows) {
          if (err) {
            if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
              console.log('Запис для лічильника ' + row.CounterNumber + ' вже існує');
              return;
            } else {
              console.log('Інша помилка в запиті на дублікати:');
              console.log(err);
              return;
            }
          } else {
            if (row.Id_pc !== '' && row.Id_pc !== null) {
              if (appNum.length == 0) {
                const varData = " VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')";
                const fullName = row.Surname + " " + row.Name + " " + row.Middlename;
                let formatedData = varData.format(date, '' + row.Id_pc, fullName, row.TelNumber, "Волинська Область", null, row.District, row.City, row.Street, row.Building, row.Apartment, row.Customer, null, row.serviceType, null, null, null, row.CounterNumber, null, row.Type, row.Year, null, row.Liter, null, null, "Проведено повірку на місці", null, row.Note, null, row.deviceNumber, null, /* TODO: */ row.Date, row.FileNumber, null, null, null, null, null);
                let varResult = ("INSERT INTO `archive`(`addingDate`, `applicationNumber`, `client`, `phoneNumber`, `region`, `cityIndex`, `district`, `settlement`, `street`, `house`, `apartment`, `serviceProvider`, `employeeName`, `serviceType`, `counterQuantity`, `isUnique`, `isDismantled`, `counterNumber`, `symbol`, `counterType`, `productionYear`, `montageDate`, `acumulatedVolume`, `haveSeal`, `sealNumber`, `status`, `comment`, `note`, `taskDate`, `stationNumber`, `laboratory`, `protocolDate`, `protocolNumber`, `protocolSignDate`, `suitableFor`, `documentPrintDate`, `idForStation`, `positionInTask`)" + formatedData);
                connection.query(varResult, (err) => {
                  if (err) {
                    console.log(err);
                  }
                });
                console.log('Відсутні помилки в запиті на додавання: ' + row.Id_pc);
              } else {
                connection.query("UPDATE `archive` SET `status`='Проведено повірку', `protocolDate`='" + row.Date + "', `protocolNumber`='" + row.FileNumber + "' WHERE `applicationNumber`='" + row.Id_pc + "';", (err) => {
                  if (err) {
                    console.log(err);
                  }
                  // TODO: Метод, який вибирає лічильники і якщо числа рівні то Update station task where id set status
                  setTaskStatusDone(appNum[0].idForStation);
                });
                console.log('Відсутні помилки в запиті на оновлення: ' + row.Id_pc);
              }
            } else {
              const varData = " VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')";
              const fullName = row.Surname + " " + row.Name + " " + row.Middlename;

							applicationNumber = createNextApplicationNumber(applicationNumber);

              let formatedData = varData.format(date, applicationNumber, fullName, row.TelNumber, "Волинська Область", null, row.District, row.City, row.Street, row.Building, row.Apartment, row.Customer, null, row.serviceType, null, null, null, row.CounterNumber, null, row.Type, row.Year, null, row.Liter, null, null, "Проведено повірку на місці", null, row.Note, null, row.deviceNumber, null, row.Date, row.FileNumber, null, null, null, null, null);
              let varResult = ("INSERT INTO `archive`(`addingDate`, `applicationNumber`, `client`, `phoneNumber`, `region`, `cityIndex`, `district`, `settlement`, `street`, `house`, `apartment`, `serviceProvider`, `employeeName`, `serviceType`, `counterQuantity`, `isUnique`, `isDismantled`, `counterNumber`, `symbol`, `counterType`, `productionYear`, `montageDate`, `acumulatedVolume`, `haveSeal`, `sealNumber`, `status`, `comment`, `note`, `taskDate`, `stationNumber`, `laboratory`, `protocolDate`, `protocolNumber`, `protocolSignDate`, `suitableFor`, `documentPrintDate`, `idForStation`, `positionInTask`)" + formatedData);
              connection.query(varResult, (err) => {
                if (err) {
                  console.log(err);
                }
              });
              console.log('Відсутні помилки в запиті на додавання: ' + applicationNumber + ' K');
            }
          }
        });
      });
    }
  });
}

// Функція, що перевіряє, чи виконане завдання порівнюючи кількості виконаних заявок до всіх
function setTaskStatusDone(idForStation) {
  connection.query("SELECT (SELECT COUNT(*) FROM `archive` WHERE idForStation='" + idForStation + "' AND (status LIKE 'Проведено%' OR status LIKE 'Надіслано%' OR status LIKE 'Повірено%')) AS resolved_counter, (SELECT COUNT(*) FROM `archive` WHERE idForStation='" + idForStation + "') AS all_counter FROM dual;", (err, counters) => {
    if (err) {
      console.log(err);
    }
    // якщо виконаних заявок менше ніж всіх для завданнях, то її idForStation заносимо в масив
    if (counters[0].resolved_counter = counters[0].all_counter) {
      connection.query("UPDATE `station_tasks` SET `task_status`='Виконано' WHERE `id_task`='" + idForStation + "';", (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

// ApplicationNumber creation
// TODO: проблема з парсом дати
function createApplicationNumber(lastApplicationNumber, addingDate) {
  let cutDate = "00000000";

  if (typeof lastApplicationNumber !== 'undefined' && lastApplicationNumber.length >= 8) {
    cutDate = lastApplicationNumber.substr(0, 8);
  }

	let dateArray = addingDate.split('-');
	let dateLike = dateArray[0] + dateArray[1] + dateArray[2];

  if (dateLike == cutDate) {
    return createNextApplicationNumber(lastApplicationNumber);
  }

  return dateLike + "000000";
}

function generateFormatedDateString(addingDate) {
  const date = new Date(addingDate);
  let day = date.getUTCDate();
  let month = date.getUTCMonth() + 1;
  let year = date.getUTCFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return year.toString() + "." + month.toString() + "." + day.toString();
}

function parseProtocol(byteArray, fileName) {
  const tests = [];
  // TODO: додати поле для номеру станції
  const protocol = {
    bbiFileName: '',
    capacity: '',
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
  const date = new Date(`${protocol.month}.${protocol.day}.${protocol.year} ${protocol.hours}:${protocol.minutes}`);

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

  protocol.capacity = '' + bytesToInt(liter);
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

  // Image
  protocol.image = coder.encode(bytesToImage(bbiFile, 0));

  // Широта
  const latitude = bbiFile.slice(84, 88);
  protocol.latitude = bytesToInt(latitude) / 100000;
  // Довгота
  const longitude = bbiFile.slice(88, 92);
  protocol.longitude = bytesToInt(longitude) / 100000;

  // Сертифікат
  const num5 = bytesToInt(bbiFile.slice(120, 124));
  if (num5 === 0) {
    protocol.protocolStatus = (true);
    protocol.status = 'В зоні';
  } else {
    protocol.protocolStatus = (false);
    protocol.status = 'Не в зоні';
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

    // Протокол "В зоні" чи "Не в зоні"
    if (test.isInZone === 'В зоні') {
      protocol.status = 'Разблокирован';
    } else if (test.isInZone === 'Не в зоні') {
      protocol.status = 'Заблокирован';
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
  let denyNumberCounter = 0;
  let validNumberCounter = 0;
  let isNotInZoneCounter = 0;
  protocol.tests.forEach(test => {
    if (test.result === 'Не годен') {
      denyNumberCounter++;
    } else if (test.result === 'Годен') {
      validNumberCounter++;
    }
    if (test.isInZone === 'Не в зоні') {
      isNotInZoneCounter++;
    }
  });

  if (validNumberCounter >= 3) {
    protocol.result = 'Годен';
  } else if (denyNumberCounter > 0) {
    protocol.result = 'Не годен';
  } else {
    protocol.result = 'Не обработан';
  }

  if (isNotInZoneCounter > 0) {
    protocol.status = 'Не в зоні';
  } else {
    protocol.status = 'В зоні';
  }
  if (protocol.counterNumber.length < 4 || protocol.bbiFileName == '00000000.bbi') {

  } else {
    addProtocol(protocol);
  }
}

function uintToString(bytes) {
  const encodedString = String.fromCharCode.apply(null, bytes),
    decodedString = decodeURIComponent(escape(encodedString));
  return decodedString;
}

function addProtocol(protocol) {
  let errorObject = '';
  let varPart = "INSERT INTO `protocols`(`bbiFileName`, `date`, `deviceNumber`, `systemDeviceNumber`, `counterNumber`,`symbol` , `type`, `image`, `counterPurpose`, `temperature`, `productionYear`, `capacity`, `latitude`, `longitude`, `status`, `result`, `signDate`, `signPerson`, `protocolStatus`) ";
  let varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
  let formatedData = varData.format(protocol.bbiFileName, generateFormatedDateString(protocol.date), protocol.deviceNumber, null, protocol.counterNumber, protocol.symbol, protocol.type, protocol.image, null, protocol.temperature, protocol.productionYear, protocol.capacity, protocol.latitude, protocol.longitude, protocol.status, protocol.result, null, null, protocol.protocolStatus);

  // TODO: додати count для кількості дублікатів
  connection.query(varPart + formatedData, function (err, rows) {
    if (err) {
      if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
        console.log('Помилка додавання. Існує дублікат для: ' + protocol.bbiFileName);
        io.getIo().emit('upload', {
          err: protocol.bbiFileName + ': Уже додано'
        });
        return;
      } else {
        console.log('Інша помилка при перевірці на дублікати:');
        io.getIo().emit('upload', {
          err: protocol.bbiFileName + ': Помилка читання файлу'
        });
        console.log(err);
        return;
      }
    } else {
      io.getIo().emit('upload', {
        msg: 'Файл додано: ' + protocol.bbiFileName
      });
      protocol.tests.forEach(test => {
        varPart = "INSERT INTO `tests`(`bbiFileName`, `name`, `installedExes`, `etalonCapacity`, `initValue`, `finalValue`, `counterCapacity`, `testDuration`, `mediumExes`, `isInZone`, `assumedFault`, `calculatedFault`, `result`, `startStateImage`, `endStateImage`) ";
        varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
        formatedData = varData.format(test.bbiFileName, test.name, test.installedExes, test.etalonCapacity, test.initValue, test.finalValue, test.counterCapacity, test.testDuration, test.mediumExes, test.isInZone, test.assumedFault, test.calculatedFault, test.result, test.startStateImage, test.endStateImage);
        connection.query(varPart + formatedData);
      });
    }
  });

}

router.post('', upload.single('file'), (req, res, next) => {
  fs.readFile('./backend/temp/tempo.zip', function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      let counterValue = 0;
      zip.forEach(async function (relativePath, zipEntry) {
        if (zipEntry.name.includes('.bbi')) {
          counterValue++;
        }
      });
      if (counterValue == 0) {
        io.getIo().emit('upload', {
          err: 'Не знайдено файлів протоколів'
        });
        return;
      }
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
  res.json({
    result: 'success'
  });
})
// Отримання всіх протоколів
router.get('', (req, res, next) => {
  connection.query('SELECT * from protocols', function (err, rows) {
    if (err) throw err;

    let selection = "SELECT * FROM tests";

    connection.query(selection, function (err, testRows) {
      if (err) throw err;

      let testArray = [];
      let protocolArray = [];

      for (let i in testRows) {
        let rt = new Object();
        rt.id = testRows[i].id;
        rt.bbiFileName = testRows[i].bbiFileName;
        rt.name = testRows[i].name;
        rt.installedExes = testRows[i].installedExes;
        rt.etalonCapacity = testRows[i].etalonCapacity;
        rt.initValue = testRows[i].initValue;
        rt.finalValue = testRows[i].finalValue;
        rt.counterCapacity = testRows[i].counterCapacity;
        rt.testDuration = testRows[i].testDuration;
        rt.mediumExes = testRows[i].mediumExes;
        rt.isInZone = testRows[i].isInZone;
        rt.assumedFault = testRows[i].assumedFault;
        rt.calculatedFault = testRows[i].calculatedFault;
        rt.result = testRows[i].result;
        rt.startStateImage = testRows[i].startStateImage;
        rt.endStateImage = testRows[i].endStateImage;

        testArray.push(rt);
      }

      for (let i in rows) {
        let rp = new Object();
        rp.id = rows[i].id;
        rp.protocolNumber = rows[i].bbiFileName;
        rp.date = rows[i].date;
        rp.deviceNumber = rows[i].deviceNumber;
        rp.systemNumber = rows[i].systemDeviceNumber;
        rp.counterNumber = rows[i].counterNumber;
        rp.symbol = rows[i].symbol;
        rp.type = rows[i].type;
        rp.counterPurpose = rows[i].counterPurpose;
        rp.temperature = rows[i].temperature;
        rp.productionYear = rows[i].productionYear;
        rp.capacity = rows[i].capacity;
        rp.latitude = rows[i].latitude;
        rp.longitude = rows[i].longitude;
        rp.isInZone = rows[i].status;
        rp.result = rows[i].result;
        rp.signDate = rows[i].signDate;
        rp.signName = rows[i].signPerson;
        rp.status = rows[i].protocolStatus;
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
