const pool = require('../config/db');

class Order {
    static async createOrder(orderData) {
        try {
            const { clientId, products, totalAmount, paymentMethod, status, deliveryAddress, deliveryFee, note, deliveryQuarter, phoneNumber, deliveryName, deliveryPhoneNumber } = orderData;

            const [result] = await pool.query(
                `INSERT INTO commandes (
                    client_id, total_amount, payment_method, status,
                    delivery_address, delivery_fee, note, delivery_quarter, phone_number,
                    delivery_name, delivery_phone_number, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [
                    clientId, totalAmount, paymentMethod, status,
                    deliveryAddress, deliveryFee, note, deliveryQuarter, phoneNumber,
                    deliveryName, deliveryPhoneNumber
                ]
            );

            const orderId = result.insertId;

            // Insérer les produits de la commande
            for (const product of products) {
                await pool.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price) 
                     VALUES (?, ?, ?, ?)`,
                    [orderId, product.productId, product.quantity, product.price]
                );
            }

            return { id: orderId, ...orderData };
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            throw error;
        }
    }

    static async getAllOrders() {
        try {
            const [rows] = await pool.query(
                `SELECT c.*, u.nom as client_nom, u.prenom as client_prenom, u.email as client_email
                 FROM commandes c
                 JOIN utilisateurs u ON c.client_id = u.id`
            );
            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération de toutes les commandes:', error);
            throw error;
        }
    }

    static async getOrderDetails(orderId) {
        try {
            const [orders] = await pool.query(
                `SELECT c.*, u.nom as client_nom, u.prenom as client_prenom, u.email as client_email
                 FROM commandes c
                 JOIN utilisateurs u ON c.client_id = u.id
                 WHERE c.id = ?`,
                [orderId]
            );
            const order = orders[0];

            if (order) {
                const [items] = await pool.query(
                    `SELECT oi.*, p.nom as product_name, p.prix as product_price
                     FROM order_items oi
                     JOIN produits p ON oi.product_id = p.id
                     WHERE oi.order_id = ?`,
                    [orderId]
                );
                order.products = items;
            }
            return order;
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de la commande:', error);
            throw error;
        }
    }

    static async updateOrderStatus(orderId, status) {
        try {
            await pool.query(
                `UPDATE commandes SET status = ?, updated_at = NOW() WHERE id = ?`,
                [status, orderId]
            );
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la commande:', error);
            throw error;
        }
    }

    static async getClientOrders(clientId) {
        try {
            const [rows] = await pool.query(
                `SELECT c.*, u.nom as client_nom, u.prenom as client_prenom
                 FROM commandes c
                 JOIN utilisateurs u ON c.client_id = u.id
                 WHERE c.client_id = ?
                 ORDER BY c.created_at DESC`,
                [clientId]
            );
            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes du client:', error);
            throw error;
        }
    }
}

module.exports = Order;
