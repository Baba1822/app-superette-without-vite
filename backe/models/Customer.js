const pool = require('../config/db');

class Customer {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM clients');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ nom, prenom, email, telephone, adresse }) {
    const [result] = await pool.query(
      'INSERT INTO clients (nom, prenom, email, telephone, adresse, date_inscription) VALUES (?, ?, ?, ?, ?, NOW())',
      [nom, prenom, email, telephone, adresse]
    );
    return result.insertId;
  }

  static async update(id, { nom, prenom, email, telephone, adresse }) {
    await pool.query(
      'UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ? WHERE id = ?',
      [nom, prenom, email, telephone, adresse, id]
    );
  }

  static async updateStatus(id, status) {
    await pool.query(
      'UPDATE clients SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  static async getStats(id) {
    const [rows] = await pool.query(
      `SELECT 
        COUNT(v.id) as totalOrders,
        SUM(p.prix) as totalSpent,
        MAX(v.date_vente) as lastOrderDate
       FROM ventes v
       LEFT JOIN produits p ON v.product_id = p.id
       WHERE v.client_id = ?`,
      [id]
    );
    return rows[0] || { totalOrders: 0, totalSpent: 0, lastOrderDate: null };
  }

  static async delete(id) {
    await pool.query('DELETE FROM clients WHERE id = ?', [id]);
  }
}

module.exports = Customer;