const mysql = require('mysql');
const settings = require('./config');
let db;

function connectDatabase() {
  if (!db) {
    db = mysql.createConnection(settings);

    db.connect(function (err) {
      if (!err) {
        console.log('Database is connected!');
      } else {
        console.log('Error connecting database!');
        console.log(err);
        
      }
    });
  }
  return db;
}

module.exports = connectDatabase();
