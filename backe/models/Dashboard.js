const pool = require('../config/db');

class Dashboard {
    static async getDashboardStats() {
        const [stats] = await pool.query(
            `SELECT 
                (SELECT COUNT(*) FROM clients WHERE statut = 'actif') as clients_actifs,
                (SELECT COUNT(*) FROM employes WHERE statut = 'actif') as employes_actifs,
                (SELECT COUNT(*) FROM commandes WHERE DATE(date_creation) = CURDATE()) as commandes_jour,
                (SELECT COUNT(*) FROM livraisons WHERE DATE(date_creation) = CURDATE()) as livraisons_jour,
                (SELECT COUNT(*) FROM depenses WHERE DATE(date_depense) = CURDATE()) as depenses_jour,
                (SELECT SUM(montant_total) FROM commandes WHERE DATE(date_creation) = CURDATE()) as chiffre_affaires_jour,
                (SELECT COUNT(*) FROM commandes WHERE DATE(date_creation) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()) as commandes_semaine,
                (SELECT SUM(montant_total) FROM commandes WHERE DATE(date_creation) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()) as chiffre_affaires_semaine,
                (SELECT COUNT(*) FROM commandes WHERE DATE(date_creation) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()) as commandes_mois,
                (SELECT SUM(montant_total) FROM commandes WHERE DATE(date_creation) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()) as chiffre_affaires_mois
            `);
        return stats[0];
    }

    static async getSalesByCategory(filters = {}) {
        let query = `SELECT c.nom as categorie_nom, 
            COUNT(*) as nombre_ventes, 
            SUM(di.montant_total) as chiffre_affaires
            FROM commandes co
            LEFT JOIN details_commande di ON co.id = di.commande_id
            LEFT JOIN produits p ON di.produit_id = p.id
            LEFT JOIN categories_produits c ON p.categorie_id = c.id
            WHERE co.statut = 'terminee'`;
        const params = [];

        if (filters.startDate) {
            query += ' AND co.date_creation >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND co.date_creation <= ?';
            params.push(filters.endDate);
        }

        query += ' GROUP BY c.id ORDER BY chiffre_affaires DESC';

        const [sales] = await pool.query(query, params);
        return sales;
    }

    static async getDeliveryStats(filters = {}) {
        let query = `SELECT 
            COUNT(*) as total_livraisons,
            SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
            SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
            SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
            AVG(DATEDIFF(date_livraison, date_creation)) as temps_moyen_livraison
            FROM livraisons`;
        const params = [];

        if (filters.startDate) {
            query += ' WHERE date_creation >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += (params.length > 0 ? ' AND ' : ' WHERE ') + 'date_creation <= ?';
            params.push(filters.endDate);
        }

        const [stats] = await pool.query(query, params);
        return stats[0];
    }

    static async getCustomerStats(filters = {}) {
        let query = `SELECT 
            COUNT(*) as total_clients,
            SUM(CASE WHEN statut = 'actif' THEN 1 ELSE 0 END) as actifs,
            AVG(DATEDIFF(CURDATE(), date_inscription)) as age_moyen_compte,
            AVG(nombre_achats) as achats_moyens
            FROM clients`;
        const params = [];

        if (filters.startDate) {
            query += ' WHERE date_inscription >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += (params.length > 0 ? ' AND ' : ' WHERE ') + 'date_inscription <= ?';
            params.push(filters.endDate);
        }

        const [stats] = await pool.query(query, params);
        return stats[0];
    }
}

module.exports = Dashboard;
