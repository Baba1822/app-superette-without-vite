const pool = require('../config/db');

class Supplier {
    static async getAll() {
        try {
            const [suppliers] = await pool.query('SELECT * FROM fournisseurs');
            return suppliers;
        } catch (error) {
            console.error('Error in Supplier.getAll:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [suppliers] = await pool.query(
                'SELECT * FROM fournisseurs WHERE id = ?',
                [id]
            );
            return suppliers[0];
        } catch (error) {
            console.error('Error in Supplier.getById:', error);
            throw error;
        }
    }

    static async create(supplierData) {
        try {
            const [result] = await pool.query(
                'INSERT INTO fournisseurs (nom, telephone, email, adresse) VALUES (?, ?, ?, ?)',
                [supplierData.nom, supplierData.telephone, supplierData.email, supplierData.adresse]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error in Supplier.create:', error);
            throw error;
        }
    }

    static async update(id, supplierData) {
        try {
            await pool.query(
                'UPDATE fournisseurs SET nom = ?, telephone = ?, email = ?, adresse = ? WHERE id = ?',
                [supplierData.nom, supplierData.telephone, supplierData.email, supplierData.adresse, id]
            );
            return true;
        } catch (error) {
            console.error('Error in Supplier.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM fournisseurs WHERE id = ?', [id]);
            return true;
        } catch (error) {
            console.error('Error in Supplier.delete:', error);
            throw error;
        }
    }

    static async search(query) {
        try {
            const [suppliers] = await pool.query(
                'SELECT * FROM fournisseurs WHERE nom LIKE ? OR email LIKE ? OR telephone LIKE ?',
                [`%${query}%`, `%${query}%`, `%${query}%`]
            );
            return suppliers;
        } catch (error) {
            console.error('Error in Supplier.search:', error);
            throw error;
        }
    }
}

module.exports = Supplier;