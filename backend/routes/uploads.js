const express = require('express');
const mysql = require('mysql');
const format = require('string-format-js');

const router = express.Router();

const connection = mysql.createConnection({
	host: 'localhost',
	database: 'water_counters',
	user: 'root',
	password: 'root',
});

connection.connect(err => {
	if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}
	console.log('Connected as id ' + connection.threadId);
});

router.post('', (req, res, next) => {
	// Add data to database
	
	let varPart = "INSERT INTO `protocols`(`Номер_протоколу`, `Дата_та_час`, `Номер_установки`, `Системний_номер_установки`, `Номер_лічильника`, `Тип_лічильника`, `Призначення_лічильника`, `Температура`, `Рік_випуску`, `Накопичений_обєм`, `Широта`, `Довгота`, `Статус_витрати`, `Результат_тесту`, `Дата_підпису_протоколу`, `ПІБ_особи_підписувача`, `Статус`) ";
	let varData = "VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');";
	let formatedData = varData.format(null, req.body.date, req.body.deviceNumber, null, req.body.counterNumber, req.body.type, null, req.body.temperature, req.body.productionYear, req.body.capacity, null, null, req.body.status, req.body.result, null, null, req.body.protocolStatus);

	connection.query(varPart + formatedData);

	console.log('uploaded');
	// req.body - весь протокол 
	// req.body.test - тести і так далі 
});

module.exports = router;