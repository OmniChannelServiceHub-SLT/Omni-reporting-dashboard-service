const express = require('express');

const createDashboardSummary = require('./APIs/createDashboardSummary/routes/route');
const listFTTHRequestStatusCount = require('./APIs/listFTTHRequestStatusCount/routes/route');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'omnichannel-dashboard-repirting-service',
    port: Number(process.env.PORT || 3010),
  });
});

app.use('/', createDashboardSummary);
app.use('/',listFTTHRequestStatusCount); //no tmf

module.exports = app;