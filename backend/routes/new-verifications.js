const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const router = express.Router();

const connection = require('../database/db');

router.get('/employee', (req, res, next) => {
  connection.query("SELECT `name` FROM employees;", (err, name) => {
    res.send(name);
  });
});

router.get('/dn', (req, res, next) => {
  connection.query("SELECT DISTINCT `DN` FROM type;", (err, symbol) => {
    res.send(symbol);
  });
});

router.get('/device', (req, res, next) => {
  connection.query("SELECT `Device` FROM type;", (err, type) => {
    res.send(type);
  });
});

// Запит для отримання усіх повірок get
router.get('', (req, res, next) => {

  connection.query("SELECT * FROM archive WHERE `status`='' OR `status` IS NULL OR `status`='Не визначено відповідальну особу' AND `employeeName`='' OR `employeeName` IS NULL", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

// 1. Додавання нової повірки в Archive з усіма даними і статусом "Визначено відповідальну особу"
// TODO: Встановити PrimaryKey/Qniquef
router.post('', (req, res, next) => {
  // Знаходимо номер останньої створеної заявки
  console.log('Adding new ver');

  connection.query("SELECT `applicationNumber` FROM `archive` ORDER BY `applicationNumber` DESC LIMIT 1;", (err, lastNumber) => {
    let applicationNumber = '';
    if (lastNumber.length > 0 && lastNumber[0]) {
      applicationNumber = lastNumber[0].applicationNumber;
    } else {
      applicationNumber = createApplicationNumber(applicationNumber);
    }
    let status = "Не визначено відповідальну особу";
    if (req.body.employeeName.length > 0) {
      status = "Визначено відповідальну особу";
    }

    let varData = " VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
    let formatedData = varData.format(req.body.addingDate, createApplicationNumber(applicationNumber), req.body.client, req.body.phoneNumber, req.body.region, req.body.index, req.body.district, req.body.settlement, req.body.street, req.body.house, req.body.apartment, req.body.entrance, req.body.floor, formatDate(req.body.favorDate), req.body.sanitaryWellfare, formatDate(req.body.waterAbsentTo), req.body.serviceProvider, req.body.employeeName, req.body.serviceType, req.body.counterQuantity, req.body.isUnique, req.body.isDismantled, req.body.counterNumber, req.body.symbol, req.body.counterType, req.body.productionYear, formatDate(req.body.montageDate), req.body.acumulatedVolume, req.body.haveSeal, null, req.body.comment, req.body.note, status);
    let varResult = ("INSERT INTO `archive`(`addingDate`, `applicationNumber`, `client`, `phoneNumber`, `region`, `cityIndex`, `district`, `settlement`, `street`, `house`, `apartment`,`entrance`,`floor`,`favorDate`,`sanitaryWellfare`,`waterAbsentTo`, `serviceProvider`, `employeeName`, `serviceType`, `counterQuantity`, `isUnique`, `isDismantled`, `counterNumber`, `symbol`, `counterType`, `productionYear`, `montageDate`, `acumulatedVolume`, `haveSeal`, `sealNumber`, `comment`, `note`, `status`)" + formatedData);
    connection.query(varResult, (err, result) => {
      if (err) {
        console.log(err);
      }

      console.log('Нова повірка створена. Визначено відповідальну особу ' + createApplicationNumber(applicationNumber));
    });
  });
  res.json({
    g: 'good'
  });
});
// TODO: винести в utils TODO: datapicker
function formatDate(taskDate) {
  let fullTaskDate = taskDate;
  let splitedTaskDate = fullTaskDate.split('T')[0];
  let formatedTasskDate = splitedTaskDate.split('-')[2] + '-' + splitedTaskDate.split('-')[1] + '-' + splitedTaskDate.split('-')[0];
 console.log({
	 full: fullTaskDate,
	 formated: formatedTasskDate		
 });
 
	return splitedTaskDate;
}

// 2. Відхилення заявки зі зміною статусу на "Відхилено" rejected
// TODO: пофіксити Update
router.put('/rejected/:id', (req, res, next) => {
  let varResult = "UPDATE `archive` SET `status`='Відхилено' WHERE `applicationNumber`='" + req.params.id + "';";
  connection.query(varResult, () => {
    res.status(200);
  });
});

// З new werif select і в task_planinig з додаванням ПІБ потім видалити з new_verif
router.post('/employee/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `status`='Визначено відповідальну особу', `employeeName`='" + req.body.employee + "' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
    res.status(201).send({
      msg: 'success'
    });
    console.log('Призначено відповідальну особу.');
  });
  // req.params.id - це номер заявки
  // req.body.employee - ПІБ
});

// 4) Видалення повірки delete
router.delete('/:id', (req, res, next) => {
  let query = "DELETE FROM `archive` WHERE `applicationNumber`='" + req.params.id + "';";

  connection.query(query, () => {
    res.status(200);
  });
});

// Перевірка на дублі по адресі клієнта (район, вулиця, будинок, квартира)
router.post('/duplicate', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE " +
    "(`district`='" + req.body.district +
    "', `street`= '" + req.body.street +
    "', `house`= '" + req.body.house +
    "', `apartment` = '" + req.body.flat + "');", (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json(result);
    });
});

function createApplicationNumber(lastApplicationNumber) {
  let cutDate = "00000000";

  if (typeof lastApplicationNumber !== 'undefined' && lastApplicationNumber.length >= 8) {
    cutDate = lastApplicationNumber.substr(0, 8);
  }

  let dateLike = generateDateString();

  if (dateLike == cutDate) {
    return parseInt(lastApplicationNumber) + 1;
  }


  return parseInt(dateLike) * 1000000 + 1;
}

function generateDateString() {
  const date = new Date();
  let day = date.getUTCDate();
  let month = date.getUTCMonth() + 1;
  let year = date.getUTCFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return day.toString() + month.toString() + year.toString();
}

module.exports = router;
