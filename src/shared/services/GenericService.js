const { randomUUID } = require('crypto');
const BaseRepository = require('../repositories/BaseRepository');

class GenericService {
  constructor(table) { this.repo = new BaseRepository(table); this.table = table; }
  async create(payload) {
    const item = { id: randomUUID(), createdAt: new Date().toISOString(), ...payload };
    return this.repo.insert(item);
  }
  async getById(id) {
    console.log("id in service",id,this.repo);
    const item = await this.repo.get(id);
    if (!item) throw new Error(` item not found`);
    return item;
  }
  async list() {
    console.log("table in service",this.repo);
    return this.repo.list(); }
  async update(id, patch) {
    const updated = await this.repo.update(id, { ...patch, updatedAt: new Date().toISOString() });
    if (!updated) throw new Error(` item not found`);
    return updated;
  }
  async remove(id) {
    const ok = await this.repo.remove(id);
    if (!ok) throw new Error(` item not found`);
    return true;
  }
}

module.exports = GenericService;
