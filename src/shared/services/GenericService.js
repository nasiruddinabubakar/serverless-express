const { randomUUID } = require('crypto');
const BaseRepository = require('../repositories/BaseRepository');

class GenericService {
  constructor(table) { this.repo = new BaseRepository(table); this.table = table; }
  async create(payload) {
    const item = { id: randomUUID(), createdAt: new Date().toISOString(), ...payload };
    return this.repo.insert(item);
  }
  async getById(id) {
    const item = await this.repo.get(id);
    if (!item) throw new Error(`${this.table} item not found`);
    return item;
  }
  async list() { return this.repo.list(); }
  async update(id, patch) {
    const updated = await this.repo.update(id, { ...patch, updatedAt: new Date().toISOString() });
    if (!updated) throw new Error(`${this.table} item not found`);
    return updated;
  }
  async remove(id) {
    const ok = await this.repo.remove(id);
    if (!ok) throw new Error(`${this.table} item not found`);
    return true;
  }
}

module.exports = GenericService;
