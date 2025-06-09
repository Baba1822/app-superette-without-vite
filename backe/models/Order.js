const pool = require('../config/db');

class Order {
    static async create(orderData) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Créer la commande
            const [orderResult] = await connection.query(
                'INSERT INTO commandes (client_id, total_amount, payment_method, status, created_at) VALUES (?, ?, ?, ?, NOW())',
                [orderData.clientId, orderData.totalAmount, orderData.paymentMethod, 'en_attente']
            );

            // Créer les détails de la commande
            const orderId = orderResult.insertId;
            const orderDetails = orderData.items.map(item => ({
                order_id: orderId,
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: item.price
            }));

            await connection.query(
                'INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES ?',
                [orderDetails]
            );

            // Mettre à jour le stock
            for (const item of orderData.items) {
                await connection.query(
                    'UPDATE produits SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.productId]
                );
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const [orders] = await pool.query(
            'SELECT c.*, cl.nom as client_nom, cl.prenom as client_prenom FROM commandes c LEFT JOIN clients cl ON c.client_id = cl.id ORDER BY c.created_at DESC'
        );
        return orders;
    }

    static async updateStatus(orderId, status) {
        await pool.query(
            'UPDATE commandes SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, orderId]
        );
    }

    static async getDetails(orderId) {
        const [details] = await pool.query(
            'SELECT od.*, p.nom as product_nom, p.prix as product_price FROM order_details od JOIN produits p ON od.product_id = p.id WHERE od.order_id = ?',
            [orderId]
        );
        return details;
    }
}

module.exports = Order;
