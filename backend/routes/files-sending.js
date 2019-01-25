const express = require('express');
const mysql = require('sql.js');
const xl = require('excel4node');
const nodemailer = require('nodemailer');
const fs = require('fs');
const AdmZip = require('adm-zip');
const format = require('string-format-js');
const path = require('path');
const router = express.Router();
const connection = require('../database/db');

const configOb = {
  stationNumber: '',
  taskDate: '',
  contactEmail: '',
  filesName: ''
};

router.post('/:id', (req, res, next) => {
  if (true) { // req.body.status = '' || req.body.status == null
    const queryStr = "SELECT * FROM archive WHERE `idForStation`= " + req.params.id + ";";
    connection.query(queryStr, (err, result) => {
      connection.query("SELECT `stationNumber`,`taskDate` FROM `station_tasks` WHERE `id_task`='" + req.params.id + "';", (err, stationRows) => {
        connection.query("SELECT `contactEmail` FROM `stations` WHERE `stationNumber`='" + stationRows[0].stationNumber + "';", (err, emails) => {
          if (err) {
            console.log(err);
          }

          configOb.stationNumber = stationRows[0].stationNumber;
          configOb.taskDate = stationRows[0].taskDate;
          configOb.contactEmail = emails[0].contactEmail;
          configOb.filesName = configOb.stationNumber + "-" + configOb.taskDate.replace(new RegExp('-', 'g'), '');
          generateFiles(result);

          res.json({
            m: 'success'
          });
        });
      });
    });
  } else {
    res.json({
      msg: 'Завдання вже надіслано'
    });
  }
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
		// TODO: додане правильне представлення бажаного часу
		let taskDateArray = task.taskDate.split('-');
    let visitDateTime = taskDateArray[0] + "." + taskDateArray[1] + "." + taskDateArray[2] + " " + task.taskTime;
    let formatedData = varData.format(task.applicationNumber,
      task.client.split(' ')[0], task.client.split(' ')[1], task.client.split(' ')[2],
      task.settlement, task.district, task.region, task.street, task.house, task.apartment,
      task.phoneNumber, visitDateTime, task.counterNumber, task.note, task.serviceProvider);
    let sqlStr = "INSERT INTO Subscribers(id_pc, surname, name, middlename, city, district," +
      " bush, street, Building, Apartment, Tel, Date_visit, Counter_number, " +
      " Note, Customer)" + formatedData;
    db.run(sqlStr);
  });

  const databaseArray = db.export();

  fs.writeFile('./backend/data/' + configOb.filesName + '.db', databaseArray, (err) => {
    if (err) throw err;
    console.log('Файл ' + configOb.filesName + '.db згенеровано ');
    generateExcelFile(taskResult);

  });
}

// Генерування листа
function generateMail() {
  nodemailer.createTestAccount((err, account) => {

    // TODO: поштова скриньки.
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'volynaquastandart@gmail.com', // generated ethereal user
        pass: 'qawsed321' // generated ethereal password
      }
    });

    let mailOptions = {
      from: 'Адреса відправника', // sender address
      to: configOb.contactEmail, // list of receivers
      subject: 'Тема', // Subject line
      text: 'Звичайний текст', // plain text body
      html: '<b>Текст в форматі html</b>', // html body
      attachments: [{ // filename and content type is derived from path
        path: './backend/data/' + configOb.filesName + '.zip'
      }, {
        path: './backend/data/' + configOb.filesName + '.db'
      }, {
        path: './backend/data/' + configOb.filesName + '.xlsx'
      }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      const directory = './backend/data';

      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      });

    });
  });
}

// Генерування табилці Excel
function generateExcelFile(taskResult) {
  console.log(taskResult);

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
    console.log(task);
// TODO: додане правильне представлення бажаного часу
let taskDateArray = task.taskDate.split('-');
let visitDateTime = taskDateArray[0] + "." + taskDateArray[1] + "." + taskDateArray[2] + " " + task.taskTime;
    ws.cell(i, 1).string(task.taskDate).style(text);
    ws.cell(i, 2).string(task.serviceProvider).style(text);
    ws.cell(i, 3).string(task.district).style(text);
    ws.cell(i, 4).string(task.street).style(text);
    ws.cell(i, 5).string(task.house).style(text);
    ws.cell(i, 6).string(task.apartment).style(text);
    ws.cell(i, 7).string(task.entrance).style(text);
    ws.cell(i, 8).string(task.floor).style(text);
    ws.cell(i, 9).string(task.counterQuantity.toString()).style(text);
    ws.cell(i, 10).string(task.client).style(text);
    ws.cell(i, 11).string(task.phoneNumber).style(text);
    ws.cell(i, 12).string(visitDateTime).style(text);
    ws.cell(i, 13).string(task.applicationNumber).style(text);
    ws.cell(i, 14).string(task.note).style(text);
    ws.cell(i, 15).string(task.comment).style(text);

    i++;
  });
  wb.write('./backend/data/' + configOb.filesName + '.xlsx', () => {
    console.log('Файл ' + configOb.filesName + '.xlsx згенеровано ');
    generateZip();
  });

}

function generateZip() {
  // creating archives
  console.log("Adding files to zip");

  const zip = new AdmZip();

  zip.addLocalFile("./backend/data/" + configOb.filesName + ".db");
  zip.addLocalFile("./backend/data/" + configOb.filesName + ".xlsx");
  zip.writeZip("./backend/data/" + configOb.filesName + ".zip");

  generateMail();
}

module.exports = router;
