const express = require('express');
const router = express.Router();

const fs = require('fs');
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const pdfMake = require('pdfmake');

const connection = require('../database/db');

router.get('/doc/:id', (req, res, next) => {
  let protocolNumber = "";
  let selection = "SELECT `id`, `Номер_заявки`, `Номер_протоколу`, `Дата_та_час`, `Номер_лічильника`, `Умовне_позначення`," +
    " `Типорозмір_лічильника`, `Температура`, `Рік_випуску`, `Накопичений_обєм`, `Статус_витрати`, " +
    " `Результат_тесту`, `Дата_підпису_протоколу`, `ПІБ_особи_підписувача`, `Статус` " +
    "FROM `protocols` WHERE `id`='" + req.params.id + "';";
  connection.query(selection, function (err, fields) {
    if (err) throw err;

    if (fields[0].Результат_тесту == 'Годен') {
      generateSvidDocx(fields);
      // Завантаження з серверу
      res.download('./backend/temp/docx/svidOutput.docx', 'svidOutput.docx');
    } else {
      protocolNumber = fields[0].Номер_протоколу;
      // query SELECT `id`,`Номер_протоколу`,`Назва_тесту`,`Фактична_витрата`,`Статус_витрати`,`Допустима_похибка`,`Фактична_похибка`,`Результат_тесту` FROM `tests` WHERE `Номер_протоколу`='" + protocolNumber + "' AND `Результат_тесту` LIKE '%оден';
      connection.query("SELECT `Назва_тесту`, `Допустима_похибка`,`Фактична_похибка`,`Результат_тесту` FROM `tests` WHERE `Номер_протоколу`='" + protocolNumber + "' AND `Результат_тесту` LIKE '%оден';", function (err, tests) {
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

function generateDovidDocx(fields, tests) {
  let content = fs.readFileSync(path.resolve('./backend/temp/docx', 'dovidtemp.docx'), 'binary');

  let zip = new JSZip(content);

  let doc = new Docxtemplater();
  doc.loadZip(zip);

  doc.setData({
		date: getDate(fields[0].Дата_та_час, 0),
		symbol: fields[0].Умовне_позначення,
		type: fields[0].Типорозмір_лічильника,
		taskNum: 'номЗав',
		Qn: '1',
		Qt: '2',
		Qmin: '3'
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

function generateSvidDocx(fields) {
  let content = fs.readFileSync(path.resolve('./backend/temp/docx', 'svidtemp.docx'), 'binary');

  let zip = new JSZip(content);

  let doc = new Docxtemplater();
  doc.loadZip(zip);

	 // TODO: на скільки років повірка?
	 // TODO: номери завдання
  doc.setData({
    date: getDate(fields[0].Дата_та_час, 4),
    symbol: fields[0].Умовне_позначення,
    type: fields[0].Типорозмір_лічильника,
    taskNum: 'номер завдання',
    singDate: getDate(fields[0].Дата_та_час, 0),
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

module.exports = router;
