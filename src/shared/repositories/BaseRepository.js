const db = require('../db/database');

class BaseRepository {
  constructor(table) { this.table = table; }
  async insert(item) { return this.table.create(item); }
  async get(id) { return this.table.findByPk(id); }
  async list() { 
    const associations = Object.values(this.table.associations);
    console.log("Table:", this.table.name, "Associations:", associations);
    return this.table.findAll({ include: associations });
  }
  async update(id, patch) { return this.table.update(patch, { where: { id } }); }
  async remove(id) { return this.table.destroy({ where: { id } }); }
}

module.exports = BaseRepository;
