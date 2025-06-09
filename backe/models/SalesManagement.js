const pool = require('../config/db');

class SalesManagement {
    static async getSalesReport(filters = {}) {
        let query = `SELECT c.*, cl.nom as client_nom, cl.email as client_email,
            cl.telephone as client_telephone, e.nom as employe_nom,
            GROUP_CONCAT(DISTINCT p.nom) as produits,
            SUM(dc.montant_total) as total_commande
            FROM commandes c
            LEFT JOIN clients cl ON c.client_id = cl.id
            LEFT JOIN employes e ON c.employe_id = e.id
            LEFT JOIN details_commande dc ON c.id = dc.commande_id
            LEFT JOIN produits p ON dc.produit_id = p.id
            WHERE c.statut = 'terminee'`;
        const params = [];

        if (filters.dateStart) {
            query += ' AND c.date_creation >= ?';
            params.push(filters.dateStart);
        }

        if (filters.dateEnd) {
            query += ' AND c.date_creation <= ?';
            params.push(filters.dateEnd);
        }

        if (filters.clientId) {
            query += ' AND c.client_id = ?';
            params.push(filters.clientId);
        }

        if (filters.employeeId) {
            query += ' AND c.employe_id = ?';
            params.push(filters.employeeId);
        }

        query += ' GROUP BY c.id ORDER BY c.date_creation DESC';

        const [sales] = await pool.query(query, params);
        return sales;
    }

    static async getSalesStatistics(filters = {}) {
        let query = `SELECT 
            COUNT(*) as total_ventes,
            SUM(dc.montant_total) as chiffre_affaires,
            AVG(dc.montant_total) as moyenne_vente,
            MAX(dc.montant_total) as vente_max,
            MIN(dc.montant_total) as vente_min,
            COUNT(DISTINCT c.client_id) as clients_uniques
            FROM commandes c
            LEFT JOIN details_commande dc ON c.id = dc.commande_id
            WHERE c.statut = 'terminee'`;
        const params = [];

        if (filters.dateStart) {
            query += ' AND c.date_creation >= ?';
            params.push(filters.dateStart);
        }

        if (filters.dateEnd) {
            query += ' AND c.date_creation <= ?';
            params.push(filters.dateEnd);
        }

        const [stats] = await pool.query(query, params);
        return stats[0];
    }

    static async getTopSellingProducts(filters = {}) {
        let query = `SELECT p.*, SUM(dc.quantite) as total_vendu,
            SUM(dc.montant_total) as chiffre_affaires
            FROM produits p
            LEFT JOIN details_commande dc ON p.id = dc.produit_id
            LEFT JOIN commandes c ON dc.commande_id = c.id
            WHERE c.statut = 'terminee'`;
        const params = [];

        if (filters.dateStart) {
            query += ' AND c.date_creation >= ?';
            params.push(filters.dateStart);
        }

        if (filters.dateEnd) {
            query += ' AND c.date_creation <= ?';
            params.push(filters.dateEnd);
        }

        query += ' GROUP BY p.id ORDER BY total_vendu DESC LIMIT 10';

        const [products] = await pool.query(query, params);
        return products;
    }

    static async getSalesByCategory(filters = {}) {
        let query = `SELECT c.nom as categorie_nom,
            COUNT(*) as nombre_ventes,
            SUM(dc.montant_total) as chiffre_affaires
            FROM categories_produits c
            LEFT JOIN produits p ON c.id = p.categorie_id
            LEFT JOIN details_commande dc ON p.id = dc.produit_id
            LEFT JOIN commandes co ON dc.commande_id = co.id
            WHERE co.statut = 'terminee'`;
        const params = [];

        if (filters.dateStart) {
            query += ' AND co.date_creation >= ?';
            params.push(filters.dateStart);
        }

        if (filters.dateEnd) {
            query += ' AND co.date_creation <= ?';
            params.push(filters.dateEnd);
        }

        query += ' GROUP BY c.id ORDER BY chiffre_affaires DESC';

        const [categories] = await pool.query(query, params);
        return categories;
    }
}

module.exports = SalesManagement;
