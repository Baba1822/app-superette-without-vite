const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Créer une nouvelle commande
router.post('/', auth, async (req, res) => {
    try {
        const { clientId, items, totalAmount, paymentMethod } = req.body;
        
        // Démarrer une transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Créer la commande
            const [result] = await connection.query(
                'INSERT INTO commandes (client_id, total_amount, payment_method, status, created_at) VALUES (?, ?, ?, ?, NOW())',
                [clientId, totalAmount, paymentMethod, 'en_attente']
            );

            // Créer les détails de la commande
            const orderId = result.insertId;
            const orderDetails = items.map(item => ({
                order_id: orderId,
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: item.price
            }));

            await connection.query(
                'INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES ?'
                [orderDetails]
            );

            // Mettre à jour le stock
            for (const item of items) {
                await connection.query(
                    'UPDATE produits SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.productId]
                );
            }

            await connection.commit();
            res.status(201).json({ id: orderId });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
});

// Récupérer toutes les commandes
router.get('/', auth, async (req, res) => {
    try {
        const [orders] = await pool.query(
            'SELECT c.*, cl.nom as client_nom, cl.prenom as client_prenom FROM commandes c LEFT JOIN clients cl ON c.client_id = cl.id ORDER BY c.created_at DESC'
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
});

// Mettre à jour le statut d'une commande
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query(
            'UPDATE commandes SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, req.params.id]
        );
        res.json({ message: 'Statut de la commande mis à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
});

module.exports = router;
