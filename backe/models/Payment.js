const pool = require('../config/db');

class Payment {
    static async createPayment(paymentData) {
        const [result] = await pool.query(
            'INSERT INTO paiements (commande_id, montant, methode_paiement, statut, date_paiement, reference) VALUES (?, ?, ?, ?, NOW(), ?)',
            [paymentData.order_id, paymentData.amount, paymentData.payment_method, 'en_attente', paymentData.reference_number]
        );
        return result.insertId;
    }

    static async updatePaymentStatus(paymentId, status, note = null) {
        const [result] = await pool.query(
            'UPDATE paiements SET statut = ?, date_paiement = NOW() WHERE id = ?',
            [status, paymentId]
        );
        return result.affectedRows > 0;
    }

    static async getPaymentById(paymentId) {
        const [payments] = await pool.query(
            'SELECT p.*, c.nom as client_name, o.montant_total as order_total FROM paiements p ' +
            'LEFT JOIN commandes o ON p.commande_id = o.id ' +
            'LEFT JOIN clients c ON o.client_id = c.id ' +
            'WHERE p.id = ?',
            [paymentId]
        );
        return payments[0];
    }

    static async getPayments(filters = {}) {
        let query = 'SELECT p.*, c.nom as client_name, o.montant_total as order_total FROM paiements p ' +
                   'LEFT JOIN commandes o ON p.commande_id = o.id ' +
                   'LEFT JOIN clients c ON o.client_id = c.id';
        const params = [];

        if (filters.clientId) {
            query += ' WHERE o.client_id = ?';
            params.push(filters.clientId);
        }

        if (filters.status) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' p.statut = ?';
            params.push(filters.status);
        }

        if (filters.date) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' DATE(p.date_paiement) = ?';
            params.push(filters.date);
        }

        query += ' ORDER BY p.date_paiement DESC';

        const [payments] = await pool.query(query, params);
        return payments;
    }

    static async createInstallmentPayment(installmentData) {
        const [result] = await pool.query(
            'INSERT INTO paiements_echelones (payment_id, amount, due_date, status) VALUES (?, ?, ?, ?)',
            [installmentData.payment_id, installmentData.amount, installmentData.due_date, 'pending']
        );
        return result.insertId;
    }

    static async updateInstallmentStatus(installmentId, status, note = null) {
        const [result] = await pool.query(
            'UPDATE paiements_echelones SET status = ?, note = ?, updated_at = NOW() WHERE id = ?',
            [status, note, installmentId]
        );
        return result.affectedRows > 0;
    }

    static async getInstallments(paymentId) {
        const [installments] = await pool.query(
            'SELECT * FROM paiements_echelones WHERE payment_id = ? ORDER BY due_date',
            [paymentId]
        );
        return installments;
    }
}

module.exports = Payment;
