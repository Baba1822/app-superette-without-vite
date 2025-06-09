const pool = require('../config/db');

class Discount {
    static async createDiscount(discountData) {
        const [result] = await pool.query(
            'INSERT INTO remises (type, pourcentage, montant, produit_id, categorie_id, ' +
            'date_debut, date_fin, description, code_remise, actif) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [discountData.type, discountData.pourcentage, discountData.montant, discountData.produit_id,
             discountData.categorie_id, discountData.date_debut, discountData.date_fin,
             discountData.description, discountData.code_remise, 1]
        );
        return result.insertId;
    }

    static async getDiscountById(id) {
        const [discounts] = await pool.query(
            'SELECT d.*, p.nom as produit_nom, c.nom as categorie_nom ' +
            'FROM remises d ' +
            'LEFT JOIN produits p ON d.produit_id = p.id ' +
            'LEFT JOIN categories_produits c ON d.categorie_id = c.id ' +
            'WHERE d.id = ?',
            [id]
        );
        return discounts[0];
    }

    static async getActiveDiscounts(filters = {}) {
        let query = 'SELECT d.*, p.nom as produit_nom, c.nom as categorie_nom ' +
                   'FROM remises d ' +
                   'LEFT JOIN produits p ON d.produit_id = p.id ' +
                   'LEFT JOIN categories_produits c ON d.categorie_id = c.id ' +
                   'WHERE d.actif = 1 AND (d.date_fin IS NULL OR d.date_fin >= CURDATE())';
        const params = [];

        if (filters.productId) {
            query += ' AND d.produit_id = ?';
            params.push(filters.productId);
        }

        if (filters.categoryId) {
            query += ' AND d.categorie_id = ?';
            params.push(filters.categoryId);
        }

        query += ' ORDER BY d.date_debut DESC';

        const [discounts] = await pool.query(query, params);
        return discounts;
    }

    static async updateDiscount(id, discountData) {
        await pool.query(
            'UPDATE remises SET type = ?, pourcentage = ?, montant = ?, produit_id = ?, ' +
            'categorie_id = ?, date_debut = ?, date_fin = ?, description = ?, code_remise = ?, ' +
            'actif = ? WHERE id = ?',
            [discountData.type, discountData.pourcentage, discountData.montant, discountData.produit_id,
             discountData.categorie_id, discountData.date_debut, discountData.date_fin,
             discountData.description, discountData.code_remise, discountData.actif, id]
        );
    }

    static async deleteDiscount(id) {
        await pool.query('DELETE FROM remises WHERE id = ?', [id]);
    }

    static async applyDiscount(discountId, amount) {
        const [discount] = await pool.query(
            'SELECT * FROM remises WHERE id = ? AND actif = 1 ' +
            'AND (date_fin IS NULL OR date_fin >= CURDATE())',
            [discountId]
        );

        if (!discount || !discount.actif) {
            throw new Error('Remise non valide ou expirée');
        }

        let discountAmount = 0;
        if (discount.type === 'pourcentage') {
            discountAmount = (amount * discount.pourcentage) / 100;
        } else if (discount.type === 'montant') {
            discountAmount = Math.min(discount.montant, amount);
        }

        return {
            id: discount.id,
            type: discount.type,
            amount: discountAmount,
            description: discount.description
        };
    }
}

module.exports = Discount;
