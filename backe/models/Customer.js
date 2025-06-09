const pool = require('../config/db');

class Customer {
    static async create(customerData) {
        const [result] = await pool.query(
            'INSERT INTO clients (nom, prenom, email, telephone, adresse, date_inscription) VALUES (?, ?, ?, ?, ?, NOW())',
            [customerData.nom, customerData.prenom, customerData.email, customerData.telephone, customerData.adresse]
        );
        return result.insertId;
    }

    static async getById(id) {
        const [customers] = await pool.query(
            'SELECT * FROM clients WHERE id = ?',
            [id]
        );
        return customers[0];
    }

    static async getByEmail(email) {
        const [customers] = await pool.query(
            'SELECT * FROM clients WHERE email = ?',
            [email]
        );
        return customers[0];
    }

    static async update(id, customerData) {
        await pool.query(
            'UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ? WHERE id = ?',
            [customerData.nom, customerData.prenom, customerData.email, customerData.telephone, customerData.adresse, id]
        );
    }

    static async getPurchaseHistory(customerId) {
        const [history] = await pool.query(
            'SELECT v.*, p.nom as product_name, p.prix as product_price ' +
            'FROM ventes v LEFT JOIN produits p ON v.product_id = p.id ' +
            'WHERE v.client_id = ? ORDER BY v.date_vente DESC',
            [customerId]
        );
        return history;
    }

    static async getLoyaltyPoints(customerId) {
        const [points] = await pool.query(
            'SELECT SUM(points) as total_points FROM points_fidelite WHERE client_id = ?',
            [customerId]
        );
        return points[0]?.total_points || 0;
    }

    static async addLoyaltyPoints(customerId, points) {
        await pool.query(
            'INSERT INTO points_fidelite (client_id, points, date_ajout) VALUES (?, ?, NOW())',
            [customerId, points]
        );
    }
}

module.exports = Customer;
