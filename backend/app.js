const express = require('express');
const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');

const uploadRoutes = require('./routes/uploads');
const newVerificationsRoutes = require('./routes/new-verifications');
const homeRoutes = require('./routes/home');
const labRequestsRoutes = require('./routes/lab-requests');
const vericationsProtocolsRoutes = require('./routes/verications-protocols');
const rejectedProtocolsRoutes = require('./routes/rejected-protocols');
const taskPlaningRoutes = require('./routes/task-planing');
const stationTasksRoutes = require('./routes/station-tasks');
const rejectedVerificationRoutes = require('./routes/rejected-verification');
const verificationsArchiveRoutes = require('./routes/verifications-archive');
const reportsRoutes = require('./routes/reports');
const userGuideRoutes = require('./routes/user-guide');
const menuRoutes = require('./routes/menu');
const fileSendingRoutes = require('./routes/files-sending');
const reportFormationRoutes = require('./routes/report-formation');
const autorizationRoutes = require('./routes/authorization');
const serviceProvidersRoutes = require('./routes/service-providers');
const employeesRoutes = require('./routes/employees');
const statusRoutes = require('./routes/status');

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://134.209.243.90:4200');

//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   res.setHeader('Access-Control-Allow-Credentials', true);

//   next();
// });

app.use(cors());

app.use(bodyParser.json({ limit: '10mb'}));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use('/api/upload', uploadRoutes);
app.use('/api/new-verifications', newVerificationsRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/report-formation', reportFormationRoutes);
app.use('/api/lab-requests', labRequestsRoutes);
app.use('/api/verications-protocols', vericationsProtocolsRoutes);
app.use('/api/rejected-protocols', rejectedProtocolsRoutes);
app.use('/api/task-planing', taskPlaningRoutes)
app.use('/api/stations-tasks', stationTasksRoutes);
app.use('/api/rejected-verification', rejectedVerificationRoutes);
app.use('/api/verifications-archive', verificationsArchiveRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/user-guide', userGuideRoutes);
app.use('/api/file-sending', fileSendingRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/authorization', autorizationRoutes);
app.use('/api/service-providers', serviceProvidersRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/status/', statusRoutes);

module.exports = app;
