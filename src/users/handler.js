const serverless = require('serverless-http');
const { makeApp } = require('../shared/utils/http');
const usersRouter = require('./routes');

const app = makeApp();
app.use('/users', usersRouter);

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

module.exports.handler = serverless(app);
