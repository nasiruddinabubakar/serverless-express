const { randomUUID } = require('crypto');
const GenericService = require('../shared/services/GenericService');
const svc = new GenericService('transformations');

async function runOperation({ operation, payload }) {
  switch (operation) {
    case 'uppercase': return String(payload ?? '').toUpperCase();
    case 'sum': return (Array.isArray(payload) ? payload : []).reduce((a, b) => a + Number(b || 0), 0);
    default: throw new Error('unknown operation');
  }
}

module.exports = {
  async create(req, res) {
    try { res.status(201).json({ success: true, data: await svc.create(req.body || {}) }); }
    catch (e) { res.status(400).json({ success: false, error: { msg: e.message } }); }
  },
  async list(_req, res) { res.json({ success: true, data: await svc.list() }); },
  async getById(req, res) {
    try { res.json({ success: true, data: await svc.getById(req.params.id) }); }
    catch (e) { res.status(404).json({ success: false, error: { msg: e.message } }); }
  },
  async update(req, res) {
    try { res.json({ success: true, data: await svc.update(req.params.id, req.body || {}) }); }
    catch (e) { res.status(404).json({ success: false, error: { msg: e.message } }); }
  },
  async remove(req, res) {
    try { await svc.remove(req.params.id); res.status(204).end(); }
    catch (e) { res.status(404).json({ success: false, error: { msg: e.message } }); }
  },
  async run(req, res) {
    try {
      const { operation, payload } = req.body || {};
      if (!operation) return res.status(400).json({ success: false, error: { msg: 'operation is required' } });
      const result = await runOperation({ operation, payload });
      const record = await svc.create({ id: randomUUID(), operation, payload, result, executedAt: new Date().toISOString() });
      res.json({ success: true, data: { operation, result, record } });
    } catch (e) {
      res.status(400).json({ success: false, error: { msg: e.message } });
    }
  }
};
