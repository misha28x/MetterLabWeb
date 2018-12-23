const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const router = express.Router();

const connection = mysql.createPool({
  
});

router.post('', (req, res, next) => {
  let varPart = "INSERT INTO `protocols`(`Номер_протоколу`, `Дата_та_час`, `Номер_установки`, `Системний_номер_установки`, `Номер_лічильника`, `Умовне_позначення`, `Типорозмір_лічильника`, `Призначення_лічильника`, `Температура`, `Рік_випуску`, `Накопичений_обєм`, `Широта`, `Довгота`, `Статус_витрати`, `Результат_тесту`, `Дата_підпису_протоколу`, `ПІБ_особи_підписувача`, `Статус`) ";
  let varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
  let formatedData = varData.format(req.body.bbiFileName, req.body.date, req.body.deviceNumber, null, req.body.counterNumber, req.body.symbol ,req.body.type, null, req.body.temperature, req.body.productionYear, req.body.capacity, null, null, req.body.status, req.body.result, null, null, req.body.protocolStatus);

  connection.query(varPart + formatedData);

  req.body.tests.forEach(test => {
    varPart = "INSERT INTO `tests`(`Номер_протоколу`, `Назва_тесту`, `Задана_витрата`, `Обєм_еталону`, `Початкове_значення`, `Кінцеве_значення`, `Обєм_за_лічильником`, `Тривалість_тесту`, `Фактична_витрата`, `Статус_витрати`, `Допустима_похибка`, `Фактична_похибка`, `Результат_тесту`) ";
    varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
    formatedData = varData.format(test.bbiFileName, test.name, test.installedExes, test.etalonCapacity, test.initValue, test.finalValue, test.counterCapacity, test.testDuration, test.mediumExes, test.isInZone, test.assumedFault, test.calculatedFault, test.result);

    connection.query(varPart + formatedData);
  });

  console.log('uploaded');
});

const asyncForLoop = async function (array, callback) {
	for (const arr of array) {
		await callback(arr);
	}
}

const getAllTests = async () => {
  let tempArray = [];
  let selection = "SELECT * FROM tests";
	console.log('get Test');
  await connection.query(selection, function(err, testRows) {
    if (err) throw err;
    console.log('getting tests');
		let rt = new Object();
		
		for (row of testRows) {
			rt.id = row.id;
			rt.bbiFileName = row.Номер_протоколу;
			rt.name = row.Назва_тесту;
			rt.installedExes = row.Задана_витрата;
			rt.etalonCapacity = row.Обєм_еталону;
			rt.initValue = row.Початкове_значення;
			rt.finalValue = row.Кінцеве_значення;
			rt.counterCapacity = row.Обєм_за_лічильником;
			rt.testDuration = row.Тривалість_тесту;
			rt.mediumExes = row.Фактична_витрата;
			rt.isInZone = row.Статус_витрати;
			rt.assumedFault = row.Допустима_похибка;
			rt.calculatedFault = row.Фактична_похибка;
			rt.result = row.Результат_тесту;

			tempArray.push(rt);
    }
  });
  return tempArray;
}

const getProtocols = async (req, res, next) => {
  console.log('Getting protocols')
  let testArray = await getAllTests();
  console.log(testArray);
	await connection.query('SELECT * from protocols', async function(err, rows, fields) {
	  
	  if (err) throw err;

		let protocolArray = [];

		for await (row of rows) {
			let rp = {};

			rp.id = row.id;
			rp.protocolNumber = row.Номер_протоколу;
			rp.date = row.Дата_та_час;
			rp.deviceNumber = row.Номер_установки;
			rp.systemNumber = row.Системний_номер_установки;
			rp.counterNumber = row.Номер_лічильника;
			rp.symbol = row.Умовне_позначення;
			rp.type = row.Типорозмір_лічильника;
			rp.counterPurpose = row.Призначення_лічильника;
			rp.temperature = row.Температура;
			rp.productionYear = row.Рік_випуску;
			rp.capacity = row.Накопичений_обєм;
			rp.width = row.Широта;
			rp.height = row.Довгота;
			rp.isInZone = row.Статус_витрати;
			rp.result = row.Результат_тесту;
			rp.signDate = row.Дата_підпису_протоколу;
			rp.signName = row.ПІБ_особи_підписувача;
			rp.status = row.Статус;

			// rp.tests = testArray.filter(() => {
      //   return el.bbiFileName == rp.protocolNumber;
      // });

			await protocolArray.push(rp);
		}
	  await res.send(protocolArray);
	});
}

router.get('', getProtocols);

module.exports = router;
