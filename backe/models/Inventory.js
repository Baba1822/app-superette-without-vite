const pool = require('../config/db');

class Inventory {
    static async getInventory(filters = {}) {
        let query = `SELECT p.*, c.nom as categorie_nom,
            (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id) as stock_actuel,
            (SELECT MAX(date_mouvement) FROM mouvements_stock WHERE produit_id = p.id) as date_dernier_mouvement,
            (SELECT type_mouvement FROM mouvements_stock WHERE produit_id = p.id ORDER BY date_mouvement DESC LIMIT 1) as dernier_mouvement
            FROM produits p
            LEFT JOIN categories_produits c ON p.categorie_id = c.id
            WHERE 1 = 1`;
        const params = [];

        if (filters.categoryId) {
            query += ' AND p.categorie_id = ?';
            params.push(filters.categoryId);
        }

        if (filters.stockStatus) {
            if (filters.stockStatus === 'low') {
                query += ' AND p.stock_min > (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id)';
            } else if (filters.stockStatus === 'expired') {
                query += ' AND p.date_peremption <= CURDATE()';
            }
        }

        query += ' ORDER BY p.nom ASC';

        const [inventory] = await pool.query(query, params);
        return inventory;
    }

    static async getStockMovements(productId, filters = {}) {
        let query = `SELECT m.*, p.nom as produit_nom, c.nom as categorie_nom,
            u.nom as utilisateur_nom
            FROM mouvements_stock m
            LEFT JOIN produits p ON m.produit_id = p.id
            LEFT JOIN categories_produits c ON p.categorie_id = c.id
            LEFT JOIN utilisateurs u ON m.utilisateur_id = u.id
            WHERE m.produit_id = ?`;
        const params = [productId];

        if (filters.startDate) {
            query += ' AND m.date_mouvement >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND m.date_mouvement <= ?';
            params.push(filters.endDate);
        }

        query += ' ORDER BY m.date_mouvement DESC';

        const [movements] = await pool.query(query, params);
        return movements;
    }

    static async getInventoryValue(filters = {}) {
        let query = `SELECT c.nom as categorie_nom,
            SUM(p.prix * (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id)) as valeur_stock
            FROM produits p
            LEFT JOIN categories_produits c ON p.categorie_id = c.id`;
        const params = [];

        if (filters.categoryId) {
            query += ' WHERE p.categorie_id = ?';
            params.push(filters.categoryId);
        }

        query += ' GROUP BY c.id ORDER BY valeur_stock DESC';

        const [values] = await pool.query(query, params);
        return values;
    }

    static async getStockAlerts() {
        const [alerts] = await pool.query(
            `SELECT p.*, c.nom as categorie_nom,
                (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id) as stock_actuel
                FROM produits p
                LEFT JOIN categories_produits c ON p.categorie_id = c.id
                WHERE p.stock_min > (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id)
                ORDER BY p.date_peremption ASC`);
        return alerts;
    }
}

module.exports = Inventory;
