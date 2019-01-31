const xl = require('excel4node');

// Генерування табилці Excel
const generateExcelFile = (taskResult, stringName) => {

  return new Promise((resolve, reject) => {
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
      let visitDateTime = taskDateArray[2] + "." + taskDateArray[1] + "." + taskDateArray[0] + " " + task.taskTime;
      ws.cell(i, 1).string(taskDateArray[2] + "-" + taskDateArray[1] + "-" + taskDateArray[0]).style(text);
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
    wb.write('./backend/data/' + stringName + '.xlsx', () => {
      console.log('Файл ' + stringName + '.xlsx згенеровано ');
      resolve('./backend/data/' + stringName + '.xlsx');
    });
  });
}

module.exports.generateExcelFile = generateExcelFile;
