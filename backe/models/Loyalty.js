const pool = require('../config/db');

class Loyalty {
    static async getClientLoyalty(clientId) {
        const [loyalty] = await pool.query(
            `SELECT 
                l.points,
                l.current_level as currentLevel,
                l.next_level as nextLevel,
                l.progress as progress,
                l.date_dernier_achat as lastPurchaseDate,
                (SELECT COUNT(*) FROM points_recompenses WHERE client_id = ? AND date_recompense >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recentRewards,
                (SELECT COUNT(*) FROM commandes WHERE client_id = ? AND statut = 'terminee' AND date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recentPurchases
                FROM loyalty l
                WHERE l.client_id = ?`,
            [clientId, clientId, clientId]
        );
        return loyalty[0];
    }

    static async getAvailableRewards(clientId) {
        const [rewards] = await pool.query(
            `SELECT r.*, 
                CASE 
                    WHEN r.points_requis <= (SELECT points FROM loyalty WHERE client_id = ?) THEN 'available'
                    ELSE 'locked'
                END as status
                FROM recompenses r
                ORDER BY r.points_requis ASC`,
            [clientId]
        );
        return rewards;
    }

    static async getRecentTransactions(clientId, limit = 5) {
        const [transactions] = await pool.query(
            `SELECT t.*, p.nom as produit_nom, c.nom as categorie_nom
                FROM transactions_loyalty t
                LEFT JOIN produits p ON t.produit_id = p.id
                LEFT JOIN categories_produits c ON p.categorie_id = c.id
                WHERE t.client_id = ?
                ORDER BY t.date_transaction DESC
                LIMIT ?`,
            [clientId, limit]
        );
        return transactions;
    }

    static async redeemReward(clientId, rewardId) {
        const [loyalty] = await pool.query(
            'SELECT points FROM loyalty WHERE client_id = ?',
            [clientId]
        );

        const [reward] = await pool.query(
            'SELECT points_requis, type_recompense, description FROM recompenses WHERE id = ?',
            [rewardId]
        );

        if (loyalty[0].points < reward[0].points_requis) {
            throw new Error('Points insuffisants pour cette récompense');
        }

        await pool.beginTransaction();
        try {
            // Déduire les points
            await pool.query(
                'UPDATE loyalty SET points = points - ? WHERE client_id = ?',
                [reward[0].points_requis, clientId]
            );

            // Créer l'historique de récompense
            await pool.query(
                'INSERT INTO historique_recompenses (client_id, recompense_id, date_recompense) VALUES (?, ?, NOW())',
                [clientId, rewardId]
            );

            await pool.commit();
            return true;
        } catch (error) {
            await pool.rollback();
            throw error;
        }
    }
}

module.exports = Loyalty;
