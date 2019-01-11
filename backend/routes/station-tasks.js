const express = require('express');
const mysql = require('mysql');
const xl = require('excel4node');

const router = express.Router();

const connection = require('../database/db');

router.get('', (req, res, next) => {
  connection.query('SELECT * FROM station_tasks', (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let query = "SELECT * FROM verifications_archive WHERE `id_для_станції`='" + req.params.id +
    "' ORDER BY `позиція_завдання` DESC;";

  connection.query(query, () => {
    res.status(200);
  });
});

router.get('/excel/:id', (req, res, next) => {
  let query = "SELECT * FROM verifications_archive WHERE `id_для_станції`='" + req.params.id +
    "' ORDER BY `позиція_завдання` DESC;";

  connection.query(query, (err, taskResult) => {
    if (err) {
      console.log(error);
    }
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

    wb.write('./backend/data/checkExcel.xlsx');
		console.log('Excel згенерований успішно!');
		 res.download('./backend/data/checkExcel.xlsx', 'checkExcel.xlsx');
  });
});

router.post('/position', (req, res, next) => {
  req.body.forEach(ver => {
    let query = "UPDATE `verifications_archive` SET `позиція_завдання`='" +
      ver.position + "' WHERE `id_для_станції`='" + ver.stationId + "';";

    connection.query(query, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  res.status(200);
})


module.exports = router;
