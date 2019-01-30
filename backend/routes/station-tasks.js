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
    res.json(result);
  });
});

router.get('/:id', (req, res, next) => {
  let query = "SELECT * FROM archive WHERE `idForStation`='" + req.params.id +
    "' ORDER BY `positionInTask` DESC;";

  connection.query(query, (err, rows) => {
    if (err) {
      console.log(err);
      res.json({
        err: err
      });
    }
    res.json(rows);
  });
});

// TODO: виведення невиконаних заявок в завданні за номером для станції
// !! перевірити правильність умов !!
router.get('/unresolved/:id', (req, res, next) => {
  connection.query("SELECT `addingDate`, `serviceProvider`, `client`, `district`, `street`, `house`,`apartment`,`entrance`,`floor`, `phoneNumber`, `taskTime`, `note` from archive WHERE `idForStation`='" + req.params.id + "' AND (status NOT LIKE 'Проведено%' AND status NOT LIKE 'Надіслано%' AND status NOT LIKE 'Повірено%') ORDER BY `positionInTask` DESC;", (err, rows) => {
    if (err) {
      console.log(err);
      res.json({
        err: err
      });
    }
    res.json(rows);
  });
});

// TODO: Видалити заявку з завдання `stations-task` get(:id)
router.get('/delete/:id', (req, res) => {
  connection.query("UPDATE `archive` SET `idForStation`='0', `positionInTask`='0', `status`='Визначено відповідальну особу' WHERE `applicationNumber`='" + req.params.id + "';", (err) => {
    if (err) {
      console.log(err);
    }
  });
});

// TODO: Вивести завдання в яких є невиконані заявки
router.get('/unresolved/', (req, res) => {
	// В цьому масиві зберігатимуться примітиви з id недовиконаних завдань
	let unresolvedTaskIds = [];
	// вибираємо унікальні номери завдань, які мають свій ідентифікатор
	connection.query("SELECT DISTINCT idForStation FROM archive WHERE idForStation != '0';", (err, taskIds) => {
		// для кожного завдання виконуємо наступне
		taskIds.forEach(stationTask => {
			// отримуємо значення заявок зі статусами і всіх заявок де idForStation
			connection.query("SELECT (SELECT COUNT(*) FROM `archive` WHERE idForStation='" + stationTask.idForStation + "' AND (status LIKE 'Проведено%' OR status LIKE 'Надіслано%' OR status LIKE 'Повірено%')) AS resolved_counter, (SELECT COUNT(*) FROM `archive` WHERE idForStation='" + stationTask.idForStation + "') AS all_counter FROM dual;", (err, counters) => {
				// якщо виконаних заявок менше ніж всіх для завданнях, то її idForStation заносимо в масив
				if (counters[0].resolved_counter < counters[0].all_counter) {
					unresolvedTaskIds.push(stationTask.idForStation);
				}
			});
		});
	});
});

router.get('/excel/:id', (req, res, next) => {
  let query = "SELECT * FROM archive WHERE `idForStation`='" + req.params.id +
    "' ORDER BY `positionInTask` DESC;";

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
    ws.column(11).setWidth(14);
    ws.column(12).setWidth(17);
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
      // TODO: додане правильне представлення бажаного часу
      let taskDateArray = task.taskDate.split('-');
      let visitDateTime = taskDateArray[0] + "." + taskDateArray[1] + "." + taskDateArray[2] + " " + task.taskTime;

      ws.cell(i, 1).string(task.addingDate).style(text);
      ws.cell(i, 2).string(task.serviceProvider).style(text);
      ws.cell(i, 3).string(task.district).style(text);
      ws.cell(i, 4).string(task.street).style(text);
      ws.cell(i, 5).string(task.house).style(text);
      ws.cell(i, 6).string(task.apartment).style(text);
      ws.cell(i, 7).string(task.entrance).style(text);
      ws.cell(i, 8).string(task.floor).style(text);
      ws.cell(i, 9).string(task.counterQuantity).style(text);
      ws.cell(i, 10).string(task.client).style(text);
      ws.cell(i, 11).string(task.phoneNumber).style(text);
      ws.cell(i, 12).string(visitDateTime).style(text);
      ws.cell(i, 13).string(task.applicationNumber).style(text);
      ws.cell(i, 14).string(task.note).style(text);
      ws.cell(i, 15).string(task.comment).style(text);
      i++;
    });

    let finalFileName = taskResult[0].stationNumber + '-' + taskResult[0].taskDate.replace(new RegExp('-', 'g'), '').substring(0, 4) + taskResult[0].taskDate.replace(new RegExp('-', 'g'), '').substring(6);

    wb.write(finalFileName + '.xlsx', res);
  });
});

router.post('/position', (req, res, next) => {
  req.body.forEach(ver => {
    let query = "UPDATE `archive` SET `positionInTask`='" +
      ver.position + "' WHERE `idForStation`='" + ver.stationId + "';";

    connection.query(query, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  res.status(200);
})

module.exports = router;
