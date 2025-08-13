const express = require('express');

// Creates an express app with sensible defaults
function makeApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  // Basic CORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
  });
  return app;
}

function sendOk(res, data) { return res.status(200).json({ success: true, data }); }
function sendCreated(res, data) { return res.status(201).json({ success: true, data }); }
function sendError(res, status, msg) { return res.status(status).json({ success: false, error: { msg } }); }

module.exports = { makeApp, sendOk, sendCreated, sendError };
