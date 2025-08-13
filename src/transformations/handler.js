const serverless = require('serverless-http');
const { makeApp } = require('../shared/utils/http');
const router = require('./routes');

const app = makeApp();
app.use('/transformations', router);
app.get('/health', (_req, res) => res.json({ ok: true }));

module.exports.handler = serverless(app);
