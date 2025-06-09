const pool = require('../config/db');

class Delivery {
    static async createDelivery(deliveryData) {
        const [result] = await pool.query(
            'INSERT INTO livraisons (order_id, client_id, address, status, delivery_date, delivery_time, delivery_fee, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [deliveryData.order_id, deliveryData.client_id, deliveryData.address, 'pending', deliveryData.delivery_date, deliveryData.delivery_time, deliveryData.delivery_fee]
        );
        return result.insertId;
    }

    static async updateDeliveryStatus(deliveryId, status, note = null) {
        const [result] = await pool.query(
            'UPDATE livraisons SET status = ?, note = ?, updated_at = NOW() WHERE id = ?',
            [status, note, deliveryId]
        );
        return result.affectedRows > 0;
    }

    static async getDeliveryById(deliveryId) {
        const [deliveries] = await pool.query(
            'SELECT l.*, c.nom as client_name, o.total as order_total FROM livraisons l ' +
            'LEFT JOIN clients c ON l.client_id = c.id ' +
            'LEFT JOIN commandes o ON l.order_id = o.id ' +
            'WHERE l.id = ?',
            [deliveryId]
        );
        return deliveries[0];
    }

    static async getDeliveries(filters = {}) {
        let query = 'SELECT l.*, c.nom as client_name, o.total as order_total FROM livraisons l ' +
                   'LEFT JOIN clients c ON l.client_id = c.id ' +
                   'LEFT JOIN commandes o ON l.order_id = o.id';
        const params = [];

        if (filters.status) {
            query += ' WHERE l.status = ?';
            params.push(filters.status);
        }

        if (filters.date) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' DATE(l.created_at) = ?';
            params.push(filters.date);
        }

        query += ' ORDER BY l.created_at DESC';

        const [deliveries] = await pool.query(query, params);
        return deliveries;
    }

    static async assignDeliveryToCourier(deliveryId, courierId) {
        const [result] = await pool.query(
            'UPDATE livraisons SET courier_id = ?, assigned_at = NOW() WHERE id = ?',
            [courierId, deliveryId]
        );
        return result.affectedRows > 0;
    }

    static async completeDelivery(deliveryId, rating = null) {
        const [result] = await pool.query(
            'UPDATE livraisons SET status = ?, completed_at = NOW(), rating = ? WHERE id = ?',
            ['completed', rating, deliveryId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Delivery;
