const pool = require('../config/db');

class StockReport {
    static async generateStockReport(filters = {}) {
        let query = 'SELECT p.*, c.nom as categorie_nom, s.quantite as stock_actuel, ' +
                   's.date_dernier_mouvement, s.type_dernier_mouvement, ' +
                   's.utilisateur_id as dernier_utilisateur_id, u.nom as dernier_utilisateur_nom ' +
                   'FROM produits p ' +
                   'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
                   'LEFT JOIN (SELECT produit_id, SUM(quantite) as quantite, MAX(date_mouvement) as date_dernier_mouvement, ' +
                   'type_mouvement as type_dernier_mouvement, utilisateur_id ' +
                   'FROM mouvements_stock ' +
                   'GROUP BY produit_id) s ON p.id = s.produit_id ' +
                   'LEFT JOIN utilisateurs u ON s.utilisateur_id = u.id';
        const params = [];

        if (filters.categoryId) {
            query += ' WHERE p.categorie_id = ?';
            params.push(filters.categoryId);
        }

        if (filters.stockStatus) {
            if (filters.stockStatus === 'low') {
                query += params.length ? ' AND' : ' WHERE';
                query += ' p.stock_min > s.quantite';
            } else if (filters.stockStatus === 'expired') {
                query += params.length ? ' AND' : ' WHERE';
                query += ' p.date_peremption <= CURDATE()';
            }
        }

        query += ' ORDER BY p.nom ASC';

        const [report] = await pool.query(query, params);
        return report;
    }

    static async getStockMovements(productId, filters = {}) {
        let query = 'SELECT m.*, p.nom as produit_nom, c.nom as categorie_nom, u.nom as utilisateur_nom ' +
                   'FROM mouvements_stock m ' +
                   'LEFT JOIN produits p ON m.produit_id = p.id ' +
                   'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
                   'LEFT JOIN utilisateurs u ON m.utilisateur_id = u.id ' +
                   'WHERE m.produit_id = ?';
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

    static async getStockValue(filters = {}) {
        let query = 'SELECT SUM(p.prix * s.quantite) as total_value, c.nom as categorie_nom ' +
                   'FROM produits p ' +
                   'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
                   'LEFT JOIN (SELECT produit_id, SUM(quantite) as quantite ' +
                   'FROM mouvements_stock ' +
                   'GROUP BY produit_id) s ON p.id = s.produit_id';
        const params = [];

        if (filters.categoryId) {
            query += ' WHERE p.categorie_id = ?';
            params.push(filters.categoryId);
        }

        query += ' GROUP BY c.id ORDER BY total_value DESC';

        const [values] = await pool.query(query, params);
        return values;
    }

    static async getStockAlerts() {
        const [alerts] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom, ' +
            '(SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id) as stock_actuel ' +
            'FROM produits p ' +
            'LEFT JOIN categories_produits c ON p.categorie_id = c.id ' +
            'WHERE p.stock_min > (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id) ' +
            'ORDER BY p.date_peremption ASC'
        );
        return alerts;
    }
}

module.exports = StockReport;
