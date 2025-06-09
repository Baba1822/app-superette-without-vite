const pool = require('../config/db');

class Promotion {
    static async createPromotion(promotionData) {
        const [result] = await pool.query(
            'INSERT INTO promotions (nom, description, type, valeur, date_debut, date_fin, ' +
            'produit_id, categorie_id, minimum_achat, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [promotionData.nom, promotionData.description, promotionData.type, promotionData.valeur,
             promotionData.date_debut, promotionData.date_fin, promotionData.produit_id,
             promotionData.categorie_id, promotionData.minimum_achat, 'active']
        );
        return result.insertId;
    }

    static async getPromotionById(id) {
        const [promotions] = await pool.query(
            'SELECT p.*, pr.nom as produit_nom, c.nom as categorie_nom, u.nom as utilisateur_nom ' +
            'FROM promotions p ' +
            'LEFT JOIN produits pr ON p.produit_id = pr.id ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'LEFT JOIN utilisateurs u ON p.utilisateur_id = u.id ' +
            'WHERE p.id = ?',
            [id]
        );
        return promotions[0];
    }

    static async getActivePromotions(filters = {}) {
        let query = 'SELECT p.*, pr.nom as produit_nom, c.nom as categorie_nom, u.nom as utilisateur_nom ' +
                   'FROM promotions p ' +
                   'LEFT JOIN produits pr ON p.produit_id = pr.id ' +
                   'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
                   'LEFT JOIN utilisateurs u ON p.utilisateur_id = u.id ' +
                   'WHERE p.status = ? AND p.date_debut <= CURDATE() AND p.date_fin >= CURDATE()';
        const params = ['active'];

        if (filters.productId) {
            query += ' AND p.produit_id = ?';
            params.push(filters.productId);
        }

        if (filters.categoryId) {
            query += ' AND p.categorie_id = ?';
            params.push(filters.categoryId);
        }

        query += ' ORDER BY p.date_debut DESC';

        const [promotions] = await pool.query(query, params);
        return promotions;
    }

    static async updatePromotion(id, promotionData) {
        await pool.query(
            'UPDATE promotions SET nom = ?, description = ?, type = ?, valeur = ?, date_debut = ?, ' +
            'date_fin = ?, produit_id = ?, categorie_id = ?, minimum_achat = ?, status = ? WHERE id = ?',
            [promotionData.nom, promotionData.description, promotionData.type, promotionData.valeur,
             promotionData.date_debut, promotionData.date_fin, promotionData.produit_id,
             promotionData.categorie_id, promotionData.minimum_achat, promotionData.status, id]
        );
    }

    static async deletePromotion(id) {
        await pool.query('DELETE FROM promotions WHERE id = ?', [id]);
    }

    static async getPromotionHistory(productId) {
        const [history] = await pool.query(
            'SELECT p.*, u.nom as utilisateur_nom FROM promotions p ' +
            'LEFT JOIN utilisateurs u ON p.utilisateur_id = u.id ' +
            'WHERE p.produit_id = ? ORDER BY p.date_debut DESC',
            [productId]
        );
        return history;
    }

    static async getPromotionsByCategory(categoryId) {
        const [promotions] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM promotions p ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE p.categorie_id = ? AND p.status = ? ORDER BY p.date_debut DESC',
            [categoryId, 'active']
        );
        return promotions;
    }

    static async applyPromotion(promotionId, totalAmount) {
        const [promotion] = await pool.query(
            'SELECT * FROM promotions WHERE id = ? AND status = ? AND date_debut <= CURDATE() AND date_fin >= CURDATE()',
            [promotionId, 'active']
        );

        if (!promotion) {
            throw new Error('Promotion non valide ou expirée');
        }

        let discount = 0;
        switch (promotion.type) {
            case 'pourcentage':
                discount = totalAmount * (promotion.valeur / 100);
                break;
            case 'montant':
                discount = promotion.valeur;
                break;
            case 'achat_reduit':
                if (totalAmount >= promotion.minimum_achat) {
                    discount = promotion.valeur;
                }
                break;
        }

        return discount;
    }
}

module.exports = Promotion;
