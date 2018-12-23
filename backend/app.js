const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const uploadRoutes = require('./routes/uploads');
const taskVerificationRoutes = require('./routes/task-verification');
const newVerificationsRoutes = require('./routes/new-verifications');
// added
const home = require('./routes/home');
const providesRequests = require('./routes/provides-requests');
const labRequests = require('./routes/lab-requests');
const vericationsProtocols = require('./routes/verications-protocols');
const rejectedProtocols = require('./routes/rejected-protocols');
const stationTasks = require('./routes/station-tasks');
const brigadeTasks = require('./routes/brigade-tasks');
const rejectedVerification = require('./routes/rejected-verification');
const verificationsArchive = require('./routes/verifications-archive');
const reports = require('./routes/reports');
const userGuide = require('./routes/user-guide');


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
app.use('/api/new-verifications', newVerificationsRoutes);
// added
app.use('/api/home', home);
app.use('/api/provides-requests', providesRequests);
app.use('api/lab-requests', labRequests);
app.use('/api/verications-protocols', vericationsProtocols);
app.use('/api/rejected-protocols', rejectedProtocols);
app.use('/api/station-tasks', stationTasks);
app.use('/api/brigade-tasks', brigadeTasks);
app.use('/api/rejected-verification', rejectedVerification);
app.use('/api/verifications-archive', verificationsArchive);
app.use('/api/reports', reports);
app.use('/api/user-guide', userGuide);


module.exports = app;
