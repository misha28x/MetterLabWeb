const xl = require('excel4node');

function currentDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  return mm + '-' + dd + '-' + yyyy;
}

module.exports.currentDate = currentDate;

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
  console.log({
    формат_дати: taskDate
  });
  if (taskDate == '' || taskDate == null) {
    return ['', ''];
  }
  let fullTaskDate = '' + taskDate;
  let splitedTaskDate = fullTaskDate.split('T')[0];
  let splitedTaskTime = '' + fullTaskDate.split('T')[1];
  return [splitedTaskDate, splitedTaskTime.substr(0, 5)];
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
        name: 'Arial',
        size: 10
      },
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

    // Стиль для тексту
    let text = wb.createStyle({
      font: {
        size: 10,
        name: 'Arial'
      },
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

    let ws = wb.addWorksheet('Завдання');

    // Ширина для колонок
    ws.column(1).setWidth(14);
    ws.column(2).setWidth(23);
    ws.column(3).setWidth(12);
    ws.column(4).setWidth(23);
    ws.column(5).setWidth(9);
    ws.column(6).setWidth(9);
    ws.column(7).setWidth(7);
    ws.column(8).setWidth(7);
    ws.column(9).setWidth(20);
    ws.column(10).setWidth(32);
    ws.column(11).setWidth(14);
    ws.column(12).setWidth(17);
    ws.column(13).setWidth(17);
    ws.column(14).setWidth(68);
    ws.column(15).setWidth(20);

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
      if (task.taskTime == null || task.taskTime == '') task.taskTime = "00:00"
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

// Генерування звітів
const generateReportExcel = (reportResult, stringName) => {

  return new Promise((resolve, reject) => {
    const wb = new xl.Workbook();

    // Стиль для заголовків
    let headers = wb.createStyle({
      font: {
        bold: true,
        size: 10,
        name: 'Arial',
      },
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

    // Стиль для тексту
    let text = wb.createStyle({
      font:{
				size: 10,
				  name: 'Arial',
			}, border: {
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

    let ws = wb.addWorksheet('Завдання');

    // Ширина для колонок 
    ws.column(1).setWidth(23);
    ws.column(2).setWidth(18);
    ws.column(3).setWidth(16);
    ws.column(4).setWidth(18);
    ws.column(5).setWidth(13);
    ws.column(6).setWidth(13);
    ws.column(7).setWidth(16);
    ws.column(8).setWidth(12);
    ws.column(9).setWidth(15);
    ws.column(10).setWidth(15);
    ws.column(11).setWidth(7);
    ws.column(12).setWidth(9);
    ws.column(13).setWidth(10);
    ws.column(14).setWidth(9);
    ws.column(15).setWidth(9);
    ws.column(16).setWidth(11);
    ws.column(17).setWidth(11);
    ws.column(18).setWidth(40);
    ws.column(19).setWidth(13);
    ws.column(20).setWidth(17);
    ws.column(21).setWidth(17);
    ws.column(22).setWidth(15);
    ws.column(23).setWidth(12);
    ws.column(24).setWidth(15);
    ws.column(25).setWidth(24);
    ws.column(26).setWidth(19);
    ws.column(27).setWidth(10);
    ws.column(28).setWidth(7);
    ws.column(29).setWidth(14);
    ws.column(30).setWidth(25);
    ws.column(31).setWidth(15);
    ws.column(32).setWidth(14);
    ws.column(33).setWidth(15);
    ws.column(34).setWidth(23);
    ws.column(35).setWidth(16);
    ws.column(36).setWidth(27);
    ws.column(37).setWidth(27);
    ws.column(38).setWidth(15);
    ws.column(39).setWidth(15);

    ws.cell(1, 1).string('Надавач послуг').style(headers);
    ws.cell(1, 2).string('Дата вимірювання').style(headers);
    ws.cell(1, 3).string('Дата документа').style(headers);
    ws.cell(1, 4).string('№ документа').style(headers);
    ws.cell(1, 5).string('№ установки').style(headers);
    ws.cell(1, 6).string('№ протоколу').style(headers);
    ws.cell(1, 7).string('Прізвище').style(headers);
    ws.cell(1, 8).string('Імя').style(headers);
    ws.cell(1, 9).string('По-батькові').style(headers);
    ws.cell(1, 10).string('Місто').style(headers);
    ws.cell(1, 11).string('Район').style(headers);
    ws.cell(1, 12).string('Вулиця').style(headers);
    ws.cell(1, 13).string('Будинок').style(headers);
    ws.cell(1, 14).string('Квартира').style(headers);
    ws.cell(1, 15).string('Телефон 1').style(headers);
    ws.cell(1, 16).string('Телефон 2').style(headers);
    ws.cell(1, 17).string('Номер пломби').style(headers);
    ws.cell(1, 18).string('Примітка').style(headers);
    ws.cell(1, 19).string('Дата надсилання').style(headers);
    ws.cell(1, 20).string('Номер лічильника').style(headers);
    ws.cell(1, 21).string('Тип лічильника').style(headers);
    ws.cell(1, 22).string('Типорозмір').style(headers);
    ws.cell(1, 23).string('Рік випуску лічильника').style(headers);
    ws.cell(1, 24).string('Накопичений об\'єм').style(headers);
    ws.cell(1, 25).string('Коментар').style(headers);
    ws.cell(1, 26).string('t, °C').style(headers);
    ws.cell(1, 27).string('Тип послуги').style(headers);
    ws.cell(1, 28).string('№ заявки').style(headers);
    ws.cell(1, 29).string('Статус').style(headers);
    ws.cell(1, 30).string('Придатний до').style(headers);
    ws.cell(1, 31).string('Дата видачі документу').style(headers);
    ws.cell(1, 32).string('Дата демонтажу').style(headers);
    ws.cell(1, 33).string('Назва демонтажної бригади').style(headers);
    ws.cell(1, 34).string('ПІБ працівника (демонтаж)').style(headers);
    ws.cell(1, 35).string('Дата монтажу').style(headers);
    ws.cell(1, 36).string('ПІБ працівника (монтаж)').style(headers);
    ws.cell(1, 37).string('Документ').style(headers);
    ws.cell(1, 38).string('№ документа').style(headers);
    ws.cell(1, 39).string('Дата документа').style(headers);

    let i = 2;
    reportResult.forEach(rep => {

      let nameParts = rep.client.split(' ');

      // TODO: додане правильне представлення бажаного часу
      ws.cell(i, 1).string(rep.serviceProvider).style(text);
      ws.cell(i, 2).string(rep.protocolDate.split(' ')[0]).style(text);
      ws.cell(i, 3).string(rep.protocolSignDate).style(text);
      ws.cell(i, 4).string().style(text); // Номер документа
      ws.cell(i, 5).string(rep.stationNumber).style(text);
      ws.cell(i, 6).string(rep.protocolNumber).style(text);
      ws.cell(i, 7).string(nameParts[0]).style(text);
      ws.cell(i, 8).string(nameParts[1]).style(text);
      ws.cell(i, 9).string(nameParts[2]).style(text);
      ws.cell(i, 10).string(rep.settlement).style(text);
      ws.cell(i, 11).string(rep.district).style(text);
      ws.cell(i, 12).string(rep.street).style(text);
      ws.cell(i, 13).string(rep.house).style(text);
      ws.cell(i, 14).string(rep.apartment).style(text);
      ws.cell(i, 15).string(rep.phoneNumber).style(text);
      ws.cell(i, 16).string(rep.secondNumber).style(text);
      ws.cell(i, 17).string(rep.sealNumber).style(text);
      ws.cell(i, 18).string(rep.note).style(text);
      ws.cell(i, 19).string(rep.taskDate).style(text);
      ws.cell(i, 20).string(rep.counterNumber).style(text);
      ws.cell(i, 21).string(rep.symbol).style(text);
      ws.cell(i, 22).string(rep.counterType).style(text);
      ws.cell(i, 23).string(rep.productionYear).style(text);
      ws.cell(i, 24).string(rep.acumulatedVolume).style(text);
      ws.cell(i, 25).string(rep.comment).style(text);
      ws.cell(i, 26).string().style(text); // Температура
      ws.cell(i, 27).string(rep.serviceType).style(text);
      ws.cell(i, 28).string(rep.applicationNumber).style(text);
      ws.cell(i, 29).string(rep.status).style(text);
      ws.cell(i, 30).string(rep.suitableFor).style(text);
      ws.cell(i, 31).string(rep.documentPrintDate).style(text);
      ws.cell(i, 32).string().style(text);
      ws.cell(i, 33).string().style(text);
      ws.cell(i, 34).string().style(text);
      ws.cell(i, 35).string(rep.protocolDate.split(' ')[0]).style(text);
      ws.cell(i, 36).string().style(text);
      ws.cell(i, 37).string().style(text);
      ws.cell(i, 38).string().style(text);
      ws.cell(i, 39).string().style(text);

      i++;
    });
    wb.write('./backend/data/' + stringName + '.xlsx', () => {
      console.log('Звіт ' + stringName + '.xlsx згенеровано ');
      resolve('./backend/data/' + stringName + '.xlsx');
    });
  });
}

module.exports.generateReportExcel = generateReportExcel;
