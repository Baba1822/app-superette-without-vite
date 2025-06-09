const pool = require('../config/db');

class LoyaltyStatus {
    static async getClientLoyaltyStatus(clientId) {
        const [status] = await pool.query(
            'SELECT c.*, ' +
            '(SELECT COUNT(*) FROM commandes WHERE client_id = c.id) as nombre_commandes, ' +
            '(SELECT SUM(montant_total) FROM commandes WHERE client_id = c.id) as total_depenses, ' +
            '(SELECT COUNT(*) FROM commandes WHERE client_id = c.id AND statut = "terminee") as commandes_terminees, ' +
            '(SELECT COUNT(*) FROM commandes WHERE client_id = c.id AND statut = "en_attente") as commandes_en_attente, ' +
            '(SELECT COUNT(*) FROM commandes WHERE client_id = c.id AND statut = "annulee") as commandes_annulees ' +
            'FROM clients c ' +
            'WHERE c.id = ?',
            [clientId]
        );
        return status[0];
    }

    static async getLoyaltyPointsHistory(clientId) {
        const [history] = await pool.query(
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
        return history;
    }

    static async redeemPoints(clientId, pointsToRedeem) {
        // Vérifier les points disponibles
        const [client] = await pool.query(
            'SELECT points_fidelite FROM clients WHERE id = ?',
            [clientId]
        );

        if (!client || client.points_fidelite < pointsToRedeem) {
            throw new Error('Points insuffisants');
        }

        // Mettre à jour les points
        await pool.query(
            'UPDATE clients SET points_fidelite = points_fidelite - ? WHERE id = ?',
            [pointsToRedeem, clientId]
        );

        // Créer l'historique de rachat
        await pool.query(
            'INSERT INTO historique_points (client_id, points, type_operation, date_operation) ' +
            'VALUES (?, ?, "rachat", NOW())',
            [clientId, pointsToRedeem]
        );

        return {
            points_restants: client.points_fidelite - pointsToRedeem,
            message: 'Points rachetés avec succès'
        };
    }

    static async getLoyaltyRewards(clientId) {
        const [rewards] = await pool.query(
            'SELECT r.*, cl.nom as client_nom, cl.email as client_email, ' +
            'cl.telephone as client_telephone, ' +
            'GROUP_CONCAT(DISTINCT p.nom) as produits ' +
            'FROM remises_loyalite r ' +
            'LEFT JOIN clients cl ON r.client_id = cl.id ' +
            'LEFT JOIN produits p ON r.produit_id = p.id ' +
            'WHERE r.client_id = ? ' +
            'GROUP BY r.id ' +
            'ORDER BY r.date_creation DESC',
            [clientId]
        );
        return rewards;
    }

    static async applyLoyaltyDiscount(rewardId, cartId) {
        const [reward] = await pool.query(
            'SELECT * FROM remises_loyalite WHERE id = ? AND actif = 1 ' +
            'AND (date_fin IS NULL OR date_fin >= CURDATE())',
            [rewardId]
        );

        if (!reward || !reward.actif) {
            throw new Error('Récompense non valide ou expirée');
        }

        // Vérifier si le panier existe
        const [cart] = await pool.query(
            'SELECT * FROM paniers WHERE id = ? AND date_validation IS NULL',
            [cartId]
        );

        if (!cart) {
            throw new Error('Panier non valide');
        }

        // Appliquer la remise
        const discount = {
            id: reward.id,
            type: reward.type,
            amount: reward.montant,
            description: reward.description
        };

        // Créer l'historique d'utilisation
        await pool.query(
            'INSERT INTO historique_remises (remise_id, panier_id, date_utilisation) ' +
            'VALUES (?, ?, NOW())',
            [rewardId, cartId]
        );

        return discount;
    }
}

module.exports = LoyaltyStatus;
