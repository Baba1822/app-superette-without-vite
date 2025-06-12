const pool = require('../config/db');

class Loyalty {
    static async getClientLoyalty(clientId) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM loyalty_cards WHERE client_id = ?`,
                [clientId]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur getClientLoyalty:', error);
            throw error;
        }
    }

    static async createLoyaltyCard(clientId, initialPoints = 0) {
        try {
            const cardNumber = `CARD${String(clientId).padStart(6, '0')}`;
            
            const [result] = await pool.query(
                `INSERT INTO loyalty_cards (client_id, points, card_number, created_at, total_spent) 
                 VALUES (?, ?, ?, NOW(), 0)`,
                [clientId, initialPoints, cardNumber]
            );
            
            return { 
                id: result.insertId, 
                clientId, 
                points: initialPoints,
                cardNumber,
                created_at: new Date()
            };
        } catch (error) {
            console.error('Erreur createLoyaltyCard:', error);
            throw error;
        }
    }

    static async updateLoyaltyCard(cardId, updateData) {
        try {
            const { points, totalSpent } = updateData;
            
            await pool.query(
                `UPDATE loyalty_cards SET points = ?, total_spent = ?, updated_at = NOW() 
                 WHERE id = ?`,
                [points, totalSpent || 0, cardId]
            );
            
            const [card] = await pool.query('SELECT * FROM loyalty_cards WHERE id = ?', [cardId]);
            return card[0];
        } catch (error) {
            console.error('Erreur updateLoyaltyCard:', error);
            throw error;
        }
    }

    static async deleteLoyaltyCard(cardId) {
        try {
            // Supprimer d'abord l'historique des points
            await pool.query('DELETE FROM points_history WHERE client_id = (SELECT client_id FROM loyalty_cards WHERE id = ?)', [cardId]);
            
            // Supprimer les rédemptions
            await pool.query('DELETE FROM reward_redemptions WHERE client_id = (SELECT client_id FROM loyalty_cards WHERE id = ?)', [cardId]);
            
            // Supprimer la carte
            await pool.query('DELETE FROM loyalty_cards WHERE id = ?', [cardId]);
            
            return true;
        } catch (error) {
            console.error('Erreur deleteLoyaltyCard:', error);
            throw error;
        }
    }

    static async getAvailableRewards(clientId = null) {
        try {
            let query = `SELECT * FROM rewards WHERE active = 1`;
            const params = [];

            if (clientId) {
                query += ` AND points_required <= (SELECT COALESCE(points, 0) FROM loyalty_cards WHERE client_id = ?)`;
                params.push(clientId);
            }

            query += ` ORDER BY points_required ASC`;
            
            const [rewards] = await pool.query(query, params);
            return rewards;
        } catch (error) {
            console.error('Erreur getAvailableRewards:', error);
            // Retourner des récompenses par défaut en cas d'erreur
            return [];
        }
    }

    static async getPointsHistory(clientId) {
        try {
            const [history] = await pool.query(
                `SELECT ph.*, r.name as reward_name
                 FROM points_history ph
                 LEFT JOIN reward_redemptions rr ON ph.transaction_id = rr.id
                 LEFT JOIN rewards r ON rr.reward_id = r.id
                 WHERE ph.client_id = ? 
                 ORDER BY ph.created_at DESC`,
                [clientId]
            );
            return history;
        } catch (error) {
            console.error('Erreur getPointsHistory:', error);
            return [];
        }
    }

    static async redeemReward(clientId, rewardId, pointsToRedeem) {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Vérifier la récompense
            const [reward] = await connection.query(
                `SELECT * FROM rewards WHERE id = ? AND active = 1`,
                [rewardId]
            );
            
            if (!reward.length) {
                throw new Error('Récompense non disponible');
            }

            // Vérifier les points du client
            const [client] = await connection.query(
                `SELECT points FROM loyalty_cards WHERE client_id = ?`,
                [clientId]
            );
            
            if (!client.length || client[0].points < pointsToRedeem) {
                throw new Error('Points insuffisants');
            }

            // Déduire les points
            await connection.query(
                `UPDATE loyalty_cards SET points = points - ?, updated_at = NOW() WHERE client_id = ?`,
                [pointsToRedeem, clientId]
            );

            // Enregistrer la rédemption
            const [redemptionResult] = await connection.query(
                `INSERT INTO reward_redemptions 
                (client_id, reward_id, points_used, redemption_date) 
                VALUES (?, ?, ?, NOW())`,
                [clientId, rewardId, pointsToRedeem]
            );

            // Ajouter l'entrée dans l'historique
            await connection.query(
                `INSERT INTO points_history 
                (client_id, points, transaction_id, transaction_date, created_at) 
                VALUES (?, ?, ?, NOW(), NOW())`,
                [clientId, -pointsToRedeem, `redemption-${redemptionResult.insertId}`]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.error('Erreur redeemReward:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async addPoints(clientId, points, amount, transactionId) {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Vérifier si la carte existe, sinon la créer
            const [existingCard] = await connection.query(
                `SELECT * FROM loyalty_cards WHERE client_id = ?`,
                [clientId]
            );
            
            if (!existingCard.length) {
                await this.createLoyaltyCard(clientId, 0);
            }
            
            // Ajouter les points
            await connection.query(
                `UPDATE loyalty_cards SET 
                 points = points + ?, 
                 total_spent = total_spent + ?, 
                 updated_at = NOW() 
                 WHERE client_id = ?`,
                [points, amount, clientId]
            );

            // Ajouter l'entrée dans l'historique
            await connection.query(
                `INSERT INTO points_history 
                (client_id, points, amount, transaction_id, transaction_date, created_at) 
                VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [clientId, points, amount, transactionId]
            );

            await connection.commit();
            return { pointsAdded: points };
        } catch (error) {
            await connection.rollback();
            console.error('Erreur addPoints:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getLoyaltyStats() {
        try {
            const [stats] = await pool.query(`
                SELECT 
                    (SELECT COUNT(*) FROM loyalty_cards) as total_cards,
                    (SELECT COALESCE(SUM(points), 0) FROM loyalty_cards) as total_points,
                    (SELECT COUNT(*) FROM reward_redemptions WHERE redemption_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as redemptions_last_month,
                    (SELECT COUNT(*) FROM points_history WHERE transaction_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND points > 0) as points_added_last_month
            `);
            return stats[0] || {
                total_cards: 0,
                total_points: 0,
                redemptions_last_month: 0,
                points_added_last_month: 0
            };
        } catch (error) {
            console.error('Erreur getLoyaltyStats:', error);
            return {
                total_cards: 0,
                total_points: 0,
                redemptions_last_month: 0,
                points_added_last_month: 0
            };
        }
    }

    static async checkRewardAvailability(clientId, rewardId) {
        try {
            const [reward] = await pool.query(
                `SELECT points_required FROM rewards WHERE id = ? AND active = 1`,
                [rewardId]
            );
            
            if (!reward.length) {
                return false;
            }

            const [client] = await pool.query(
                `SELECT COALESCE(points, 0) as points FROM loyalty_cards WHERE client_id = ?`,
                [clientId]
            );
            
            return client.length && client[0].points >= reward[0].points_required;
        } catch (error) {
            console.error('Erreur checkRewardAvailability:', error);
            return false;
        }
    }
}

module.exports = Loyalty;