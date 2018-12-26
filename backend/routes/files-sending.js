const express = require('express');
const mysql = require('sql.js');
const xl = require('excel4node');
const nodemailer = require('nodemailer');
const fs = require('fs');

const router = express.Router();

router.get('', (req, res, next) => {
  generateFiles();
});

function generateFiles() {
  var db = new mysql.Database();
  var sqlString =
    "CREATE TABLE Subscribers(id_pc INT, surname TEXT, name TEXT, middlename TEXT, city TEXT, district TEXT," +
    " bush TEXT, street TEXT, Building TEXT, Apartment TEXT, Tel TEXT, Date_visit TEXT, Counter_number TEXT," +
    " Note TEXT, Customer TEXT);";
  db.run(sqlString);

  var databaseArray = db.export();
  var databaseName = 'Database.db';
  var excelName = 'Excel.xlsx'

  //var databaseFile = generateDatabaseFile(databaseName, databaseArray);
  fs.writeFile('./backend/data/Database.db', databaseArray, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  console.log(databaseName + ' згенерований успішно!');

  var excelFile = generateExcelFile(excelName);

  console.log(excelFile + ' згенерований успішно!');

  //generateMail(databaseFile, excelFile);
}

// Генерування листа
function generateMail(databaseFile, excelFile) {

}

// Генерування табилці Excel
function generateExcelFile(excelName) {
  var wb = new xl.Workbook();

  // Стиль для заголовків
  var headers = wb.createStyle({
    font: {
      bold: true,
    },
    border: {
      left: {
        style: 'medium',
        color: '#000000',
      },
      right: {
        style: 'medium',
        color: '#000000',
      },
      top: {
        style: 'medium',
        color: '#000000',
      },
      bottom: {
        style: 'medium',
        color: '#000000',
      },
    }
  });

  // Стиль для тексту
  var text = wb.createStyle({
    border: {
      left: {
        style: 'thin',
        color: '#000000',
      },
      right: {
        style: 'thin',
        color: '#000000',
      },
      top: {
        style: 'thin',
        color: '#000000',
      },
      bottom: {
        style: 'thin',
        color: '#000000',
      },
    }
  });

  var ws = wb.addWorksheet('Завдання');

  // Ширина для колонок
  ws.column(1).setWidth(16);
  ws.column(2).setWidth(22);
  ws.column(3).setWidth(10);
  ws.column(4).setWidth(21);
  ws.column(5).setWidth(11);
  ws.column(6).setWidth(11);
  ws.column(7).setWidth(11);
  ws.column(8).setWidth(11);
  ws.column(9).setWidth(24);
  ws.column(10).setWidth(32);
  ws.column(11).setWidth(12);
  ws.column(12).setWidth(14);
  ws.column(13).setWidth(17);
  ws.column(14).setWidth(72);
  ws.column(15).setWidth(11);

  ws.cell(1, 1).string('Дата завдання').style(headers);
  ws.cell(1, 2).string('Надавач послуг').style(headers);
  ws.cell(1, 3).string('Район').style(headers);
  ws.cell(1, 4).string('Вулиця').style(headers);
  ws.cell(1, 5).string('Будинок').style(headers);
  ws.cell(1, 6).string('Квартира').style(headers);
  ws.cell(1, 7).string('Під\'їзд').style(headers);
  ws.cell(1, 8).string('Поверх').style(headers);
  ws.cell(1, 9).string('Кількість лічильників').style(headers);
  ws.cell(1, 10).string('ПІБ').style(headers);
  ws.cell(1, 11).string('Телефон').style(headers);
  ws.cell(1, 12).string('Бажаний час').style(headers);
  ws.cell(1, 13).string('Номер повірки').style(headers);
  ws.cell(1, 14).string('Примітка').style(headers);
  ws.cell(1, 15).string('Коментар').style(headers);


	ws.cell(2, 2).string('default').style(text);
	//Цикл для додавання заявок в файл
/*for (let row = 2; row < tasks.length; row++) {
	const element = tasks[row];
	
}*/

  wb.write('./backend/data/Excel.xlsx');
}

/* ['Дата завдання', 'Надавач послуг', 'Район', 'Вулиця', 'Будинок', 'Квартира', 'Під\'їзд', 'Поверх',
   'Кількість лічильників', 'ПІБ', 'Телефон', 'Бажаний час', 'Номер повірки', 'Примітка', 'Коментар'
 ], */


module.exports = router;
