const GenericService = require('../shared/services/GenericService');
const svc = new GenericService('connections');

module.exports = {
  async create(req, res) {
    try {
      const created = await svc.create(req.body || {});
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      res.status(400).json({ success: false, error: { msg: e.message } });
    }
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
};
