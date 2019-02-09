const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const formatDate = require('../utils/utils').formatDate;
const createNextApplicationNumber = require('../utils/utils').createNextApplicationNumber;

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
  connection.query("SELECT `applicationNumber` FROM `archive` WHERE `addingDate` = '" + getCurrentDate() + "' ORDER BY `applicationNumber` DESC LIMIT 1;", (err, lastNumber) => {
    if (err) {
      console.log(err);
    }
    let applicationNumber = '';

    if (typeof lastNumber[0] !== 'undefined') {
      applicationNumber = createNextApplicationNumber(lastNumber[0].applicationNumber);
    } else {
      applicationNumber = generateDateString() + '000000';
    }

    let status = "Не визначено відповідальну особу";

    if (req.body.employeeName.length > 0) {
      status = "Визначено відповідальну особу";
    }

    let varData = " VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
    let formatedData = varData.format(getCurrentDate(), applicationNumber, req.body.client, req.body.phoneNumber, req.body.region, req.body.index, req.body.district, req.body.settlement, req.body.street, req.body.house, req.body.apartment, req.body.entrance, req.body.floor, formatDate(req.body.favorDate)[0], formatDate(req.body.favorDate)[1], req.body.sanitaryWellfare, formatDate(req.body.waterAbsentTo), req.body.serviceProvider, req.body.employeeName, req.body.serviceType, req.body.counterQuantity, req.body.isUnique, req.body.isDismantled, req.body.counterNumber, req.body.symbol, req.body.counterType, req.body.productionYear, formatDate(req.body.montageDate), req.body.acumulatedVolume, req.body.haveSeal, null, req.body.comment, req.body.note, status);
    let varResult = ("INSERT INTO `archive`(`addingDate`, `applicationNumber`, `client`, `phoneNumber`, `region`, `cityIndex`, `district`, `settlement`, `street`, `house`, `apartment`,`entrance`,`floor`,`favorDate`,`favorTime`,`sanitaryWellfare`,`waterAbsentTo`, `serviceProvider`, `employeeName`, `serviceType`, `counterQuantity`, `isUnique`, `isDismantled`, `counterNumber`, `symbol`, `counterType`, `productionYear`, `montageDate`, `acumulatedVolume`, `haveSeal`, `sealNumber`, `comment`, `note`, `status`)" + formatedData);
    connection.query(varResult, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log('Нова повірка створена. ' + status + '. Номер заявки: ' + applicationNumber);
    });
  });
  res.json({
    g: 'good'
  });
});

// 2. Відхилення заявки зі зміною статусу на "Відхилено" rejected
// TODO: пофіксити Update
router.get('/rejected/:id', (req, res, next) => {
  console.log('rejected');
  let varResult = "UPDATE `archive` SET `status`='Відхилено' WHERE `applicationNumber`='" + req.params.id + "';";
  connection.query(varResult, () => {
    res.status(200).json({ m: 'rejected'});
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
    res.status(200).json({m: 'success'});
  });
});

// Перевірка на дублі по адресі клієнта (район, вулиця, будинок, квартира)
router.post('/duplicate', (req, res, next) => {
  connection.query( "SELECT * FROM `archive` WHERE  +`district`='" + req.body.district + "' AND `street`= '" + req.body.street + "' AND `house`= '" + req.body.house + "'AND `apartment` = '" + req.body.flat + "';", ( err, result ) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json(result);
    });
});

// Запит, що знімає відповідальну особу з заявки
router.get('/cancel/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `employeeName`='' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
	});
	res.status(201).send({
	  msg: 'знято відповідальну особу'
	});
});

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

function getCurrentDate() {
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
	return year.toString() + '-' + month.toString() + '-' + day.toString();
}
module.exports = router;
