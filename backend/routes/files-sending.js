const express = require('express');
const mysql = require('sql.js');
const xl = require('excel4node');
const nodemailer = require('nodemailer');
const fs = require('fs');
const AdmZip = require('adm-zip');
const format = require('string-format-js');

const router = express.Router();
const connection = require('../database/db');

router.get('/:id', (req, res, next) => {

  const queryStr = "SELECT * FROM verifications_archive WHERE `id_для_станції`= " + req.params.id + ";";

  connection.query(queryStr, (err, result) => {
    if (err) {
      console.log(err);
    }
    generateFiles(result);

    // creating archives
    const zip = new AdmZip();

    zip.addLocalFile("./backend/data/Database.db");
    zip.addLocalFile("./backend/data/Excel.xlsx");
    zip.writeZip("./backend/data/task.zip");

    res.status(200);
  });
});

function generateFiles(taskResult) {
  const db = new mysql.Database();
  const sqlString =
    "CREATE TABLE Subscribers(id_pc INT, surname TEXT, name TEXT, middlename TEXT, city TEXT, district TEXT," +
    " bush TEXT, street TEXT, Building TEXT, Apartment TEXT, Tel TEXT, Date_visit TEXT, Counter_number TEXT," +
    " Note TEXT, Customer TEXT);";
  db.run(sqlString);

  taskResult.forEach(task => {
    let varData = " VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
    let formatedData = varData.format(task.Номер_заявки,
      task.Клієнт.split(' ')[0], task.Клієнт.split(' ')[1], task.Клієнт.split(' ')[2],
      task.Населений_пункт, null, null, task.Вулиця_клієнта, task.Будинок, task.Квартира,
      task.Номер_телефону, task.Дата_завдання, task.Номер_лічильника, task.Примітка, task.Надавач_послуг);
    let sqlStr = "INSERT INTO Subscribers(id_pc, surname, name, middlename, city, district," +
      " bush, street, Building, Apartment, Tel, Date_visit, Counter_number, " +
      " Note, Customer)" + formatedData;
    db.run(sqlStr);
  });

  const databaseArray = db.export();

  fs.writeFile('./backend/data/Database.db', databaseArray, (err) => {
    if (err) throw err;
    console.log('Файл Database.db успішно збережено ');
  });

  generateExcelFile(taskResult);


  // generateMail();
}

// Генерування листа
function generateMail() {
  nodemailer.createTestAccount((err, account) => {

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'dantetheslayer18@gmail.com', // generated ethereal user
        pass: 'Fuck1This2Shit3' // generated ethereal password
      }
    });

    let mailOptions = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: 'dantetheslayer18@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
      attachments: [{ // filename and content type is derived from path
        path: './backend/data/task.zip'
      }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
}

// Генерування табилці Excel
function generateExcelFile(taskResult) {
  const wb = new xl.Workbook();

  // Стиль для заголовків
  let headers = wb.createStyle({
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
  let text = wb.createStyle({
    
  });

  let ws = wb.addWorksheet('Завдання');

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

	let i = 2;
  taskResult.forEach(task => {
		ws.cell(i, 1).string(task.Дата_надходження).style(text);
		ws.cell(i, 2).string(task.Надавач_послуг).style(text);
		ws.cell(i, 3).string(' ').style(text);
		ws.cell(i, 4).string(task.Вулиця_клієнта).style(text);
		ws.cell(i, 5).string(task.Будинок).style(text);
		ws.cell(i, 6).string(task.Квартира).style(text);
		ws.cell(i, 7).string(' ').style(text);
		ws.cell(i, 8).string(' ').style(text);
		ws.cell(i, 9).string(' ').style(text);
		ws.cell(i, 10).string(task.Клієнт).style(text);
		ws.cell(i, 11).string(task.Номер_телефону).style(text);
		ws.cell(i, 12).string(task.Дата_завдання).style(text);
		ws.cell(i, 13).string(task.Номер_заявки).style(text);
		ws.cell(i, 14).string(task.Примітка).style(text);
		ws.cell(i, 15).string(task.Коментар).style(text);

    i++;
  });

  wb.write('./backend/data/Excel.xlsx');
  console.log('Excel згенерований успішно!');
}

module.exports = router;
