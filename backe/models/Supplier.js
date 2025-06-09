const pool = require('../config/db');

class Supplier {
    static async getAll() {
        const [suppliers] = await pool.query('SELECT * FROM fournisseurs');
        return suppliers;
    }

    static async getById(id) {
        const [suppliers] = await pool.query(
            'SELECT * FROM fournisseurs WHERE id = ?',
            [id]
        );
        return suppliers[0];
    }

    static async create(supplierData) {
        const [result] = await pool.query(
            'INSERT INTO fournisseurs (nom, telephone, email, adresse) VALUES (?, ?, ?, ?)',
            [supplierData.nom, supplierData.telephone, supplierData.email, supplierData.adresse]
        );
        return result.insertId;
    }

    static async update(id, supplierData) {
        await pool.query(
            'UPDATE fournisseurs SET nom = ?, telephone = ?, email = ?, adresse = ? WHERE id = ?',
            [supplierData.nom, supplierData.telephone, supplierData.email, supplierData.adresse, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM fournisseurs WHERE id = ?', [id]);
    }

    static async search(query) {
        const [suppliers] = await pool.query(
            'SELECT * FROM fournisseurs WHERE nom LIKE ? OR email LIKE ? OR telephone LIKE ?',
            [`%${query}%`, `%${query}%`, `%${query}%`]
        );
        return suppliers;
    }
}

module.exports = Supplier;
