const pool = require('../config/db');

class LoyaltyReward {
    static async createReward(rewardData) {
        const [result] = await pool.query(
            'INSERT INTO recompenses_fidelite (nom, description, points_requis, type, valeur, status) VALUES (?, ?, ?, ?, ?, ?)',
            [rewardData.nom, rewardData.description, rewardData.points_requis, rewardData.type, rewardData.valeur, 'active']
        );
        return result.insertId;
    }

    static async getRewardById(rewardId) {
        const [rewards] = await pool.query(
            'SELECT * FROM recompenses_fidelite WHERE id = ?',
            [rewardId]
        );
        return rewards[0];
    }

    static async getRewards(filters = {}) {
        let query = 'SELECT * FROM recompenses_fidelite';
        const params = [];

        if (filters.status) {
            query += ' WHERE status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY points_requis ASC';

        const [rewards] = await pool.query(query, params);
        return rewards;
    }

    static async updateReward(rewardId, rewardData) {
        await pool.query(
            'UPDATE recompenses_fidelite SET nom = ?, description = ?, points_requis = ?, type = ?, valeur = ?, status = ? WHERE id = ?',
            [rewardData.nom, rewardData.description, rewardData.points_requis, rewardData.type, rewardData.valeur, rewardData.status, rewardId]
        );
    }

    static async deleteReward(rewardId) {
        await pool.query('DELETE FROM recompenses_fidelite WHERE id = ?', [rewardId]);
    }

    static async redeemReward(rewardId, clientId) {
        // Vérifier les points du client
        const [points] = await pool.query(
            'SELECT SUM(points) as total_points FROM points_fidelite WHERE client_id = ?',
            [clientId]
        );

        if (points[0]?.total_points < rewardData.points_requis) {
            throw new Error('Points insuffisants pour cette récompense');
        }

        // Créer l'historique de récompense
        const [result] = await pool.query(
            'INSERT INTO historique_recompenses (reward_id, client_id, redemption_date) VALUES (?, ?, NOW())',
            [rewardId, clientId]
        );

        // Mettre à jour les points du client
        await pool.query(
            'INSERT INTO points_fidelite (client_id, points, type, date_ajout) VALUES (?, ?, ?, NOW())',
            [clientId, -rewardData.points_requis, 'redeem', result.insertId]
        );

        return result.insertId;
    }

    static async getRedemptionHistory(clientId) {
        const [history] = await pool.query(
            'SELECT hr.*, r.nom as reward_name, r.type, r.valeur FROM historique_recompenses hr ' +
            'LEFT JOIN recompenses_fidelite r ON hr.reward_id = r.id ' +
            'WHERE hr.client_id = ? ORDER BY hr.redemption_date DESC',
            [clientId]
        );
        return history;
    }
}

module.exports = LoyaltyReward;
