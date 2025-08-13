const GenericService = require('../shared/services/GenericService');
const { randomUUID } = require('crypto');
const svc = new GenericService('pipelines');

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
  async start(req, res) {
    const { name, input } = req.body || {};
    if (!name) return res.status(400).json({ success: false, error: { msg: 'name is required' } });
    const id = randomUUID();
    const record = await svc.create({ id, name, input, status: 'STARTED', startedAt: new Date().toISOString() });
    res.status(201).json({ success: true, data: { id, name, status: record.status } });
  }
};
