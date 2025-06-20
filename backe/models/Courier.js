const pool = require('../config/db');

// Utilisation d'un modèle simple basé sur des requêtes SQL (pas Sequelize)
const Courier = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM livreurs');
    return rows;
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM livreurs WHERE id = ?', [id]);
    return rows[0];
  },
  async create(data) {
    const { name, phone, email, status, avatarUrl } = data;
    const [result] = await pool.query(
      'INSERT INTO livreurs (name, phone, email, status, avatarUrl, deliveriesCount) VALUES (?, ?, ?, ?, ?, 0)',
      [name, phone, email, status, avatarUrl]
    );
    return { id: result.insertId, ...data, deliveriesCount: 0 };
  },
  async update(id, data) {
    const { name, phone, email, status, avatarUrl } = data;
    await pool.query(
      'UPDATE livreurs SET name = ?, phone = ?, email = ?, status = ?, avatarUrl = ? WHERE id = ?',
      [name, phone, email, status, avatarUrl, id]
    );
    return this.getById(id);
  },
  async delete(id) {
    await pool.query('DELETE FROM livreurs WHERE id = ?', [id]);
    return true;
  },
  async getHistory(id) {
    // Suppose une table livraisons avec un champ courier_id
    const [rows] = await pool.query('SELECT * FROM livraisons WHERE courier_id = ? ORDER BY date DESC', [id]);
    return rows;
  }
};

module.exports = Courier; 