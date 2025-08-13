const UserService = require('../shared/services/UserService');
const svc = new UserService();

module.exports = {
  async create(req, res) {
    try {
      const created = await svc.create(req.body || {});
      res.status(201).json({ success: true, data: created });
    } catch (e) {
      res.status(400).json({ success: false, error: { msg: e.message } });
    }
  },
  async list(_req, res) {
    const data = await svc.list();
    res.json({ success: true, data });
  },
  async getById(req, res) {
    try {
      const data = await svc.getById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      res.status(404).json({ success: false, error: { msg: e.message } });
    }
  },
  async update(req, res) {
    try {
      const data = await svc.update(req.params.id, req.body || {});
      res.json({ success: true, data });
    } catch (e) {
      res.status(404).json({ success: false, error: { msg: e.message } });
    }
  },
  async remove(req, res) {
    try {
      await svc.remove(req.params.id);
      res.status(204).end();
    } catch (e) {
      res.status(404).json({ success: false, error: { msg: e.message } });
    }
  },
};
