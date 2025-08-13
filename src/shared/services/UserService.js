const { randomUUID } = require('crypto');
const BaseRepository = require('../repositories/BaseRepository');

class UserService {
  constructor(repo = new BaseRepository('users')) {
    this.repo = repo;
  }
  async create({ email, name }) {
    if (!email || !String(email).includes('@')) throw new Error('invalid email');
    const user = { id: randomUUID(), email, name: name || null, createdAt: new Date().toISOString() };
    return this.repo.insert(user);
  }
  async getById(id) {
    const user = await this.repo.get(id);
    if (!user) throw new Error('user not found');
    return user;
  }
  async list() { return this.repo.list(); }
  async update(id, patch) {
    const updated = await this.repo.update(id, { ...patch, updatedAt: new Date().toISOString() });
    if (!updated) throw new Error('user not found');
    return updated;
  }
  async remove(id) {
    const ok = await this.repo.remove(id);
    if (!ok) throw new Error('user not found');
    return true;
  }
}

module.exports = UserService;
