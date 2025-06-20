const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Créer une nouvelle commande
router.post('/', auth, async (req, res) => {
    console.log('Requête de création de commande reçue.');
    const connection = await pool.getConnection(); // Obtenir une connexion du pool

    try {
        const { items, totalAmount, paymentMethod, deliveryAddress, deliveryFee, note, deliveryQuarter, phoneNumber } = req.body;
        const clientId = req.user.userId;

        // Démarrer une transaction
        await connection.beginTransaction();

        // 1. Créer la commande
        const [orderResult] = await connection.query(
            'INSERT INTO commandes (client_id, montant_total, methode_paiement, statut, delivery_address, delivery_fee, note, delivery_quarter, phone_number, date_creation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [clientId, totalAmount, paymentMethod, 'en_attente', deliveryAddress, deliveryFee, note, deliveryQuarter, phoneNumber]
        );
        const orderId = orderResult.insertId;

        // 2. Créer les détails de la commande
        const orderDetails = items.map(item => [
            orderId,
            item.productId,
            item.quantity,
            item.price,
            item.price * item.quantity
        ]);
        await connection.query(
            'INSERT INTO details_commande (commande_id, produit_id, quantite, prix_unitaire, montant_total) VALUES ?',
            [orderDetails]
        );
        
        // 3. Créer l'enregistrement de paiement associé
        const [paymentResult] = await connection.query(
            'INSERT INTO paiements (commande_id, montant, methode, statut, date_paiement) VALUES (?, ?, ?, ?, NOW())',
            [orderId, totalAmount, paymentMethod, 'complété'] // Statut initial du paiement
        );
        const paymentId = paymentResult.insertId;

        // Mettre à jour les stocks des produits
        for (const item of items) {
            await connection.query(
                'UPDATE produits SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.productId]
            );
            // Optionnel : vérifier si le stock devient négatif et lever une erreur
        }

        // Valider la transaction
        await connection.commit();
        
        // Notifier via WebSocket (nouvelle vente)
        try {
            const { broadcast } = require('../services/websocketService');
            broadcast({ type: 'new_sale', orderId, paymentId, totalAmount, clientId, date: new Date() });
        } catch (wsError) {
            console.error('Erreur lors de la notification WebSocket:', wsError);
        }
        
        console.log(`Commande ${orderId} et paiement ${paymentId} créés avec succès.`);
        res.status(201).json({ 
            success: true, 
            message: 'Commande et paiement créés avec succès', 
            orderId: orderId,
            paymentId: paymentId
        });

    } catch (error) {
        // En cas d'erreur, annuler la transaction
        if (connection) await connection.rollback(); 

        console.error('Erreur lors de la création de la commande et du paiement:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur lors de la création de la commande.',
            error: error.message 
        });
    } finally {
        // Libérer la connexion dans tous les cas
        if (connection) connection.release();
    }
});

// Récupérer toutes les commandes
router.get('/', auth, async (req, res) => {
    try {
        const clientId = req.user.userId; // Récupérer l'ID client depuis le token authentifié
        const userRole = req.user.role; // Supposons que le rôle est attaché à req.user.role

        let query = 'SELECT c.*, c.date_creation AS date, c.montant_total AS total, cl.nom as client_nom, cl.prenom as client_prenom FROM commandes c LEFT JOIN clients cl ON c.client_id = cl.id';
        const queryParams = [];

        if (userRole === 'client') {
            query += ' WHERE c.client_id = ?';
            queryParams.push(clientId);
        }

        query += ' ORDER BY c.date_creation DESC';

        const [orders] = await pool.query(query, queryParams);

        for (let order of orders) {
            order.total = parseFloat(order.total); // Convertir en flottant pour s'assurer que c'est un nombre
            const [items] = await pool.query(
                'SELECT od.*, p.nom as product_name FROM details_commande od JOIN produits p ON od.produit_id = p.id WHERE od.commande_id = ?',
                [order.id]
            );
            order.items = items.map(item => ({
                id: item.produit_id,
                name: item.product_name,
                quantity: item.quantite,
                price: parseFloat(item.prix_unitaire),
                total: parseFloat(item.montant_total)
            }));
        }

        res.json(orders);
    } catch (error) {
        console.error('Erreur détaillée lors de la récupération des commandes:', error); 
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes', details: error.message });
    }
});

// Récupérer une commande par ID
router.get('/:id', auth, async (req, res) => {
    try {
        const orderId = req.params.id;
        const clientId = req.user.userId;
        const userRole = req.user.role;

        let query = 'SELECT c.*, c.date_creation AS date, c.montant_total AS total, cl.nom as client_nom, cl.prenom as client_prenom FROM commandes c LEFT JOIN clients cl ON c.client_id = cl.id WHERE c.id = ?';
        const queryParams = [orderId];

        if (userRole === 'client') {
            query += ' AND c.client_id = ?';
            queryParams.push(clientId);
        }

        const [orders] = await pool.query(query, queryParams);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        const order = orders[0];
        order.total = parseFloat(order.total);

        // Récupérer les détails de la commande
        const [items] = await pool.query(
            'SELECT od.*, p.nom as product_name FROM details_commande od JOIN produits p ON od.produit_id = p.id WHERE od.commande_id = ?',
            [order.id]
        );
        order.items = items.map(item => ({
            id: item.produit_id,
            name: item.product_name,
            quantity: item.quantite,
            price: parseFloat(item.prix_unitaire),
            total: parseFloat(item.montant_total)
        }));

        res.json(order);
    } catch (error) {
        console.error('Erreur détaillée lors de la récupération de la commande:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la commande', details: error.message });
    }
});

// Mettre à jour le statut d'une commande
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status, note } = req.body.status; // Extraire status et note de l'objet status
        const orderId = req.params.id;

        await pool.query(
            'UPDATE commandes SET statut = ?, note = ?, date_mise_a_jour = NOW() WHERE id = ?',
            [status, note, orderId]
        );
        res.json({ message: 'Statut de la commande mis à jour' });
    } catch (error) {
        console.error('Erreur détaillée lors de la mise à jour du statut:', error); 
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut', details: error.message });
    }
});

module.exports = router;
