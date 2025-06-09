const pool = require('../config/db');

class StockMovement {
    static async createMovement(data) {
        const [result] = await pool.query(
            'INSERT INTO mouvements_stock (product_id, type, quantity, reason, created_at) VALUES (?, ?, ?, ?, NOW())',
            [data.product_id, data.type, data.quantity, data.reason]
        );
        return result.insertId;
    }

    static async getMovements(filters = {}) {
        let query = 'SELECT m.*, p.nom as product_name FROM mouvements_stock m LEFT JOIN produits p ON m.product_id = p.id';
        const params = [];

        if (filters.productId) {
            query += ' WHERE m.product_id = ?';
            params.push(filters.productId);
        }

        if (filters.startDate || filters.endDate) {
            if (!params.length) query += ' WHERE';
            else query += ' AND';
            query += ' m.created_at BETWEEN ? AND ?';
            params.push(filters.startDate || '2000-01-01');
            params.push(filters.endDate || '2099-12-31');
        }

        query += ' ORDER BY m.created_at DESC';

        const [movements] = await pool.query(query, params);
        return movements;
    }

    static async updateProductStock(productId, quantity) {
        await pool.query(
            'UPDATE produits SET stock = stock + ? WHERE id = ?',
            [quantity, productId]
        );
    }

    static async getCurrentStock(productId) {
        const [stock] = await pool.query(
            'SELECT stock FROM produits WHERE id = ?',
            [productId]
        );
        return stock[0]?.stock || 0;
    }
}

module.exports = StockMovement;
