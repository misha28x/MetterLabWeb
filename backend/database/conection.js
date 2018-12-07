const mysql = require('mysql');

module.exports.inint = function(configs) {
	mysql.createPool({
		host: process.env.MYSQL_HOST || configs.host,
		user: process.env.MYSQL_USER || configs.user,
		connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || configs.connectionLimit,
		database: configs.database,
		debug: configs.debug
	});
};