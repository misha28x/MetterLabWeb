const xl = require('excel4node');

// Функція, що передбачає нулі на початку чи в номері заявки. В Int гарантовано переводиться число
function createNextApplicationNumber(applicationNumber) {
  let lastApplicationNumber = applicationNumber.toString();
  let firstPart = lastApplicationNumber.substr(0, 4);
  let secondPart = parseInt(lastApplicationNumber.substr(4, 13)) + 1;
  return firstPart + secondPart;
}

module.exports.createNextApplicationNumber = createNextApplicationNumber;

// Операції виділення зображень з бінарного файлу
function bytesToImage(bbiFile, id) {
  let imgNum = 0;
  let imgLength = 0;

  switch (id) {
    case 0:
      imgNum = 4098;
      imgLength = (bbiFile[4098] & 255) << 8 | bbiFile[4099] & 255;
      break;
    case 1:
      imgNum = 20482;
      imgLength = (bbiFile[20482] & 255) << 8 | bbiFile[20483] & 255;
      break;
    case 2:
      imgNum = 36866;
      imgLength = (bbiFile[36866] & 255) << 8 | bbiFile[36867] & 255;
      break;
    case 3:
      imgNum = 53250;
      imgLength = (bbiFile[53250] & 255) << 8 | bbiFile[53251] & 255;
      break;
    case 4:
      imgNum = 69634;
      imgLength = (bbiFile[69634] & 255) << 8 | bbiFile[69635] & 255;
      break;
    case 5:
      imgNum = 86018;
      imgLength = (bbiFile[86018] & 255) << 8 | bbiFile[86019] & 255;
      break;
    case 6:
      imgNum = 102402;
      imgLength = (bbiFile[102402] & 255) << 8 | bbiFile[102403] & 255;
      break;
    case 7:
      imgNum = 118786;
      imgLength = (bbiFile[118786] & 255) << 8 | bbiFile[118787] & 255;
      break;
    case 8:
      imgNum = 135170;
      imgLength = (bbiFile[135170] & 255) << 8 | bbiFile[135171] & 255;
      break;
    case 9:
      imgNum = 151554;
      imgLength = (bbiFile[151554] & 255) << 8 | bbiFile[151555] & 255;
      break;
    case 10:
      imgNum = 167938;
      imgLength = (bbiFile[167938] & 255) << 8 | bbiFile[167939] & 255;
      break;
    case 11:
      imgNum = 184322;
      imgLength = (bbiFile[184322] & 255) << 8 | bbiFile[184323] & 255;
      break;
    case 12:
      imgNum = 200706;
      imgLength = (bbiFile[200706] & 255) << 8 | bbiFile[200707] & 255;
      break;

    default:
      break;
  }
  const imageBytes = bbiFile.slice(imgNum + 2, imgNum + 2 + imgLength);

  return imageBytes;
}

module.exports.bytesToImage = bytesToImage;

// Перехід від загального формату дати // 2019-01-24T22:00:00.000Z до 2019-01-24
function formatDate(taskDate) {
  let fullTaskDate = '' + taskDate;
  let splitedTaskDate = fullTaskDate.split('T')[0];
  return splitedTaskDate;
}

module.exports.formatDate = formatDate;

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
