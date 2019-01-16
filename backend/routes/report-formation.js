const express = require('express');
const router = express.Router();

const fs = require('fs');
const JSZip = require('../assets/jszip2');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const pdfMake = require('pdfmake');

const connection = require('../database/db');

router.get('/doc/:id', (req, res, next) => {
  let protocolNumber = "";
  let selection = "SELECT `id`, `applicationNumber`, `bbiFileName`, `date`, `counterNumber`, `deviceNumber`, `symbol`," +
    " `type`, `temperature`, `productionYear`, `capacity`, `status`, " +
    " `result`, `signDate`, `signPerson`, `status` " +
    "FROM `protocols` WHERE `id`='" + req.params.id + "';";
  connection.query(selection, function (err, fields) {
    if (err) throw err;
    console.log(fields[0]);

    if (fields[0].result == 'Годен') {
      generateSvidDocx(fields);
      // Завантаження з серверу
      res.download('./backend/temp/docx/svidOutput.docx', 'svidOutput.docx');
    } else {
      protocolNumber = fields[0].bbiFileName;
      // query SELECT `id`,`Номер_протоколу`,`Назва_тесту`,`Фактична_витрата`,`Статус_витрати`,`Допустима_похибка`,`Фактична_похибка`,`Результат_тесту` FROM `tests` WHERE `Номер_протоколу`='" + protocolNumber + "' AND `Результат_тесту` LIKE '%оден';
      connection.query("SELECT `name`, `assumedFault`,`calculatedFault`,`result` FROM `tests` WHERE `bbiFileName`='" + protocolNumber + "' AND `result` LIKE 'Не годен' ORDER BY `tests`.`name` ASC;", function (err, tests) {
        if (err) {
          throw err;
        }
        generateDovidDocx(fields, tests);
        // Завантаження з серверу
        res.download('./backend/temp/docx/dovidOutput.docx', 'dovidOutput.docx');
      });
    }
  });
});
// fields - вибірка з protocols tests - вибірка з тестів за номером протоколу
function generateDovidDocx(fields, tests) {
  let content = fs.readFileSync(path.resolve('./backend/temp/docx', 'dovidtemp.docx'), 'binary');

  let zip = new JSZip(content);

  let doc = new Docxtemplater();
  doc.loadZip(zip);

  let testsString = "";

  /**    Qn: "δQn = мінус " + type + "%;",
      Qt: "δQt = мінус " + type + "%;",
  		Qmin: "δQmin = мінус " + type + "%;", */

  for (const test of tests) {
    switch (test.name.substring(5, 6)) {
      case "1":
				testsString += ("δQn = ");
				console.log({
					value: test.calculatedFault,
					bool: test.calculatedFault < 0
				});
				
        if (test.calculatedFault < 0) {
          testsString += ("мінус ");
        }
        testsString += (percentDif(test).toFixed(1) + "%; ");
        // testsString+=("δQn = мінус " + testRes + "%;");
        break;
			case "2":
				console.log({
				  value: test.calculatedFault,
				  bool: test.calculatedFault < 0
				});
        testsString += ("δQt = ");
        if (test.calculatedFault < 0) {
          testsString += ("мінус ");
        }
        testsString += (percentDif(test).toFixed(1) + "%; ");
        break;
			case "3":
				console.log({
				  value: test.calculatedFault,
				  bool: test.calculatedFault < 0
				});
        testsString += ("δQmin = ");
        if (test.calculatedFault < 0) {
          testsString += ("мінус ");
        }
        testsString += (percentDif(test).toFixed(1) + "%; ");
        break;

      default:
        break;
    }
  }

  testsString.substring(0, testsString.length - 2);

  doc.setData({
    // TODO: Формули, номер завдання
    docNumber: createNumberString(fields[0]),
    date: getDate(fields[0].date, 0),
    symbol: fields[0].symbol,
    type: fields[0].type,
    cNumber: fields[0].counterNumber,
    testsVal: testsString.substring(0, testsString.length - 2)
    // ТЕГи прописувати тут
  });

  try {
    // заміна тегів на текст
    doc.render()
  } catch (error) {
    let e = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties,
    }
    console.log(JSON.stringify({
      error: e
    }));
    throw error;
  }

  let buf = doc.getZip().generate({
    type: 'nodebuffer'
  });

  // buffer перезаписує вміст файлу 
  fs.writeFileSync(path.resolve('./backend/temp/docx', 'dovidOutput.docx'), buf);
}
// Обчислення % для довідки
function percentDif(test) {
  let assumedFault = test.assumedFault;
  let calculatedFault = Math.abs(test.calculatedFault);

  return (calculatedFault - assumedFault) * 100 / assumedFault;
}

// fields - вибірка з protocols
function generateSvidDocx(fields) {
  let content = fs.readFileSync(path.resolve('./backend/temp/docx', 'svidtemp.docx'), 'binary');

  let zip = new JSZip(content);

  let doc = new Docxtemplater();
  doc.loadZip(zip);

  // TODO: на скільки років повірка?
  // TODO: номери завдання

  doc.setData({
    docNumber: createNumberString(fields[0]),
    cNumber: fields[0].counterNumber,
    date: getDate(fields[0].date, 4),
    symbol: fields[0].symbol,
    type: fields[0].type,
    singDate: getDate(fields[0].date, 0),
    // ТЕГи прописувати тут
  });

  try {
    // заміна тегів на текст
    doc.render()
  } catch (error) {
    let e = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties,
    }
    console.log(JSON.stringify({
      error: e
    }));
    throw error;
  }

  let buf = doc.getZip().generate({
    type: 'nodebuffer'
  });

  // buffer перезаписує вміст файлу 
  fs.writeFileSync(path.resolve('./backend/temp/docx', 'svidOutput.docx'), buf);
}

function getDate(stringDate, years) {
  let docDate = new Date(stringDate);
  let year = docDate.getFullYear() + years;
  let month = docDate.getMonth();
  let day = docDate.getDate();

  let months = ['cічня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];

  return date = day + " " + months[month] + " " + year + " р.";
}

router.get('/pdf/:id', (req, res, next) => {
  res.download('./backend/temp/docx/output1.pdf', 'output1.pdf');
});

function createNumberString(protocolObject) {
  let docDate = new Date(protocolObject.date);
  let day = docDate.getUTCDate();
  let month = docDate.getUTCMonth() + 1;
  let year = docDate.getUTCFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  let docNumberDate = day.toString() + month.toString() + year.toString().substring(2, 4);
  let docNumberProtocol = protocolObject.bbiFileName.substr(6, 2);
  return docNumberString = protocolObject.deviceNumber + docNumberDate + docNumberProtocol;
}

module.exports = router;
