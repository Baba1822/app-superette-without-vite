const pool = require('../config/db');
const Cart = require('./Cart');

class Checkout {
    static async processCheckout(cartId, paymentData) {
        // Récupérer le panier
        const cart = await Cart.getCartById(cartId);
        if (!cart) {
            throw new Error('Panier non trouvé');
        }

        // Vérifier les stocks
        const items = await Cart.getCartItems(cartId);
        for (const item of items) {
            const [stock] = await pool.query(
                'SELECT SUM(quantite) as stock FROM mouvements_stock WHERE produit_id = ?',
                [item.produit_id]
            );
            if (stock[0]?.stock < item.quantite) {
                throw new Error(`Stock insuffisant pour le produit ${item.produit_nom}`);
            }
        }

        // Créer la commande
        const [result] = await pool.query(
            'INSERT INTO commandes (client_id, montant_total, methode_paiement, ' +
            'statut, livraison_adresse, livraison_date) ' +
            'VALUES (?, ?, ?, ?, ?, ?)',
            [cart.client_id, paymentData.total, paymentData.method,
             'en_attente', paymentData.deliveryAddress, paymentData.deliveryDate]
        );
        const orderId = result.insertId;

        // Créer les détails de commande
        for (const item of items) {
            await pool.query(
                'INSERT INTO details_commande (commande_id, produit_id, quantite, ' +
                'prix_unitaire, montant_total) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.produit_id, item.quantite, item.prix_unitaire,
                 item.quantite * item.prix_unitaire]
            );
        }

        // Mettre à jour le statut du panier
        await Cart.validateCart(cartId, paymentData.method, 'en_attente');

        // Créer le mouvement de stock
        for (const item of items) {
            await pool.query(
                'INSERT INTO mouvements_stock (produit_id, quantite, type_mouvement, ' +
                'reference, utilisateur_id, date_mouvement) ' +
                'VALUES (?, ?, ?, ?, ?, NOW())',
                [item.produit_id, -item.quantite, 'vente', `COM${orderId}`, paymentData.userId]
            );
        }

        // Appliquer les points de fidélité
        const points = Math.floor(paymentData.total / 1000); // 1 point pour 1000 FCFA dépensés
        await pool.query(
            'UPDATE clients SET points_fidelite = points_fidelite + ? WHERE id = ?',
            [points, cart.client_id]
        );

        return orderId;
    }

    static async getCheckoutHistory(clientId) {
        const [orders] = await pool.query(
            'SELECT c.*, cl.nom as client_nom, cl.email as client_email, ' +
            'cl.telephone as client_telephone, ' +
            'SUM(dc.montant_total) as total_commande, ' +
            'GROUP_CONCAT(DISTINCT p.nom) as produits ' +
            'FROM commandes c ' +
            'LEFT JOIN clients cl ON c.client_id = cl.id ' +
            'LEFT JOIN details_commande dc ON c.id = dc.commande_id ' +
            'LEFT JOIN produits p ON dc.produit_id = p.id ' +
            'WHERE c.client_id = ? ' +
            'GROUP BY c.id ' +
            'ORDER BY c.date_creation DESC',
            [clientId]
        );
        return orders;
    }

    static async getCheckoutDetails(orderId) {
        const [details] = await pool.query(
            'SELECT c.*, cl.nom as client_nom, cl.email as client_email, ' +
            'cl.telephone as client_telephone, ' +
            'dc.*, p.nom as produit_nom, p.image as produit_image, ' +
            'p.prix as prix_unitaire, c.nom as categorie_nom ' +
            'FROM commandes c ' +
            'LEFT JOIN clients cl ON c.client_id = cl.id ' +
            'LEFT JOIN details_commande dc ON c.id = dc.commande_id ' +
            'LEFT JOIN produits p ON dc.produit_id = p.id ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE c.id = ?',
            [orderId]
        );
        return details;
    }
}

module.exports = Checkout;
