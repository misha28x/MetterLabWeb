const express = require('express');
const mysql = require('mysql');

const router = express.Router();

// тут має бути підключення до бази даних і підключення до бази (ще в процесі)


// тут треба буде оброблювати необхідні запити. Наприклад :
// router.post - для обробки POST запитів
// router.get - для обробки GET запитів
// і так далі


// далі цю сторінку потрібно імпортувати в app.js і там для певного шляху присвоїти 
// за допомогою app.use(<route для обробки>, <цей файл імпортований в app.js>)
module.exports = router;
