const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');
const io = require('../socket/socket');

const formatDate = require('../utils/utils').formatDate;
const createNextApplicationNumber = require('../utils/utils').createNextApplicationNumber;

const router = express.Router();

const connection = require('../database/db');

/** Відхилення заявки зі зміною статусу на "Відхилено" rejected
 * 
 * @param req.params.id - id заявки в таблиці `archive`
 * @param req.body.reason - причина відхилення взята з таблиці `rejections_types`
 */
router.post( '/rejected/:id', ( req, res, next ) => {
  console.log( req.body );
  console.log( 'rejected' );
  let varResult = "UPDATE `archive` SET `status`='Відхилено', `note`=CONCAT(note, '" + req.body.reason + "') WHERE `applicationNumber`='" + req.params.id + "';";
  connection.query( varResult, (err) => {
    if (err) {
      console.log(err);
    }
    io.getIo().emit( 'update' );
    res.status( 200 ).json( {
      m: 'rejected'
    } );
  } );
} );


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
// створено для
router.get('/:userId', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE `userId` = '" + req.params.userId + "' AND (`status` NOT LIKE 'Відхилено%' OR 'Передано повірнику' OR 'Повірено%');", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/cancel-employee/:id', (req, res, next) => {
  connection.query("UPDATE `archive` SET `employeeName`='', status='' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
    io.getIo().emit( 'update' );
  });
  res.status(200).send({
    msg: 'знято відповідальну особу'
  });
});

// 1. Додавання нової повірки в Archive з усіма даними і статусом "Визначено відповідальну особу"
// TODO: Встановити PrimaryKey/Qniquef

/**
 * @param req.body.createFor - створено для
 */
router.post('', (req, res, next) => {
  // Знаходимо номер останньої створеної заявки
  console.log({
    'Номер ост заявки': req.body.createFor
  });

  console.log(req.body);
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

    let varData = " VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
    let formatedData = varData.format(getCurrentDate(), applicationNumber, req.body.client, req.body.phoneNumber, req.body.region, req.body.index, req.body.district, req.body.settlement, req.body.street, req.body.house, req.body.apartment, req.body.entrance, req.body.floor, formatDate(req.body.favorDate)[0], formatDate(req.body.favorTime)[1], req.body.sanitaryWellfare, formatDate(req.body.waterAbsentTo)[0], req.body.serviceProvider, req.body.createFor, req.body.employeeName, req.body.serviceType, req.body.counterQuantity, req.body.isUnique, req.body.isDismantled, req.body.counterNumber, req.body.symbol, req.body.counterType, req.body.productionYear, formatDate(req.body.montageDate)[0], req.body.acumulatedVolume, req.body.haveSeal, null, req.body.comment, req.body.note, status, req.body.userId);
    let varResult = ("INSERT INTO `archive`(`addingDate`, `applicationNumber`, `client`, `phoneNumber`, `region`, `cityIndex`, `district`, `settlement`, `street`, `house`, `apartment`,`entrance`,`floor`,`favorDate`,`favorTime`,`sanitaryWellfare`,`waterAbsentTo`, `serviceProvider`, `createFor`, `employeeName`, `serviceType`, `counterQuantity`, `isUnique`, `isDismantled`, `counterNumber`, `symbol`, `counterType`, `productionYear`, `montageDate`, `acumulatedVolume`, `haveSeal`, `sealNumber`, `comment`, `note`, `status`, `userId`)" + formatedData);
    connection.query(varResult, (err, result) => {
      if (err) {
        console.log(err);
      }
      io.getIo().emit('update');
      console.log('Нова повірка створена. ' + status + '. Номер заявки: ' + applicationNumber);
    });
  });
  res.json({
    g: 'good'
  });
});

router.post('/site/', (req, res, next) => {
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

    const status = "Не визначено відповідальну особу";
    const createFor = 80334;
    const serviceProvider = 80334;
    const userId = 80334;

    let varData = " VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
    let formatedData = varData.format(getCurrentDate(), applicationNumber, req.body.client, req.body.phoneNumber, req.body.region, req.body.index, req.body.district, req.body.settlement, req.body.street, req.body.house, req.body.apartment, req.body.entrance, req.body.floor, formatDate(req.body.favorDate)[0], formatDate(req.body.favorTime)[1], req.body.sanitaryWellfare, formatDate(req.body.waterAbsentTo)[0], serviceProvider, createFor, req.body.serviceType, req.body.counterQuantity, req.body.isUnique, req.body.isDismantled, req.body.counterNumber, req.body.symbol, req.body.counterType, req.body.productionYear, formatDate(req.body.montageDate)[0], req.body.acumulatedVolume, req.body.haveSeal, null, req.body.comment, req.body.note, status, userId);
    let varResult = ("INSERT INTO `archive`(`addingDate`, `applicationNumber`, `client`, `phoneNumber`, `region`, `cityIndex`, `district`, `settlement`, `street`, `house`, `apartment`,`entrance`,`floor`,`favorDate`,`favorTime`,`sanitaryWellfare`,`waterAbsentTo`, `serviceProvider`, `createFor`, `serviceType`, `counterQuantity`, `isUnique`, `isDismantled`, `counterNumber`, `symbol`, `counterType`, `productionYear`, `montageDate`, `acumulatedVolume`, `haveSeal`, `sealNumber`, `comment`, `note`, `status`, `userId`)" + formatedData);
    connection.query(varResult, (err) => {
      if (err) {
        console.log(err);
      }
      io.getIo().emit('update');
      console.log('Нова повірка з сайту створена. ' + status + '. Номер заявки: ' + applicationNumber);
    });
  });
  res.json({
    g: 'good'
  });
});

/** Відхилення заявки зі зміною статусу на "Відхилено" rejected
 * 
 * @param req.params.id - id заявки в таблиці `archive`
 * @param req.body.reason - причина відхилення взята з таблиці `rejections_types`
 */
router.post('/rejected/:id', (req, res, next) => {
  console.log('rejected');
  let varResult = "UPDATE `archive` SET `status`='Відхилено',`idForStation`=0, `positionInTask`=0, `note`=CONCAT(note, '" + req.body.reason + "') WHERE `applicationNumber`='" + req.params.id + "';";
  connection.query(varResult, () => {
    io.getIo().emit('update');
    res.status(200).json({
      m: 'rejected'
    });
  });
});


router.post('/employee/:id', (req, res, next) => {
  console.log(req.params.id);
  connection.query("UPDATE `archive` SET `status`='Визначено відповідальну особу', `employeeName`='" + req.body.employee + "' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
    io.getIo().emit('update');
    res.status(201).send({
      msg: 'success'
    });
    console.log('Призначено відповідальну особу.');
  });
});

// 4) Видалення повірки delete
router.delete('/:id', (req, res, next) => {
  let query = "DELETE FROM `archive` WHERE `applicationNumber`='" + req.params.id + "';";

  connection.query(query, () => {
    io.getIo().emit('update');
    res.status(200).json({
      m: 'success'
    });
  });
});

router.get( '/all/address', ( req, res, next ) => {
  console.log( 'Get addreses' );
  connection.query( "SELECT * FROM `address`", ( err, address ) => {
    if ( err ) {
      console.log( err );
    }
    res.status( 200 ).json( address );
  } );
} );

// Перевірка на дублі по адресі клієнта (район, вулиця, будинок, квартира)
router.post('/duplicate', (req, res, next) => {
  connection.query("SELECT * FROM `archive` WHERE  +`district`='" + req.body.district + "' AND `street`= '" + req.body.street + "' AND `house`= '" + req.body.house + "'AND `apartment` = '" + req.body.flat + "';", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});



// Роутер для отримання всіх можливих населених пунктів і адрес


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
