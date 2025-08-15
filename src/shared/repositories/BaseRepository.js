const db = require('../db/database');

class BaseRepository {
  constructor(table) { this.table = table; }
  async insert(item) { return db.insert(this.table, item); }
  async get(id) { return db.get(this.table, id); }
  async list() { return db.list(this.table); }
  async update(id, patch) { return db.update(this.table, id, patch); }
  async remove(id) { return db.remove(this.table, id); }
}

module.exports = BaseRepository;
