const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const uploadRoutes = require('./routes/uploads');
const taskVerificationRoutes = require('./routes/task-verification');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT ,PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use(bodyParser.json({ limit: '10mb'}));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use('/api/upload', uploadRoutes);
app.use('/api/task-verification', taskVerificationRoutes);

module.exports = app;
