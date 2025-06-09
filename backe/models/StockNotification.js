const pool = require('../config/db');

class StockNotification {
    static async checkStockLevels() {
        const [lowStockProducts] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM produits p LEFT JOIN categories c ON p.categorie_id = c.id WHERE p.stock <= p.stock_alerte'
        );
        return lowStockProducts;
    }

    static async scheduleCheck() {
        await pool.query(
            'INSERT INTO taches_programmees (type, frequence, prochaine_execution) VALUES (?, ?, NOW())',
            ['stock_check', 'daily']
        );
    }

    static async getNotifications() {
        const [notifications] = await pool.query(
            'SELECT * FROM notifications_stock ORDER BY created_at DESC'
        );
        return notifications;
    }

    static async createNotification(productId, supplierId, message) {
        const [result] = await pool.query(
            'INSERT INTO notifications_stock (product_id, supplier_id, message, created_at) VALUES (?, ?, ?, NOW())',
            [productId, supplierId, message]
        );
        return result.insertId;
    }
}

module.exports = StockNotification;
