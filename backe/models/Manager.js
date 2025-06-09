const pool = require('../config/db');

class Manager {
    static async getManagerStats() {
        const [stats] = await pool.query(
            `SELECT 
                (SELECT COUNT(*) FROM employes WHERE statut = 'actif') as employes_actifs,
                (SELECT COUNT(*) FROM fournisseurs WHERE statut = 'actif') as fournisseurs_actifs,
                (SELECT COUNT(*) FROM clients WHERE statut = 'actif') as clients_actifs,
                (SELECT COUNT(*) FROM commandes WHERE statut = 'terminee') as commandes_terminees,
                (SELECT SUM(montant_total) FROM commandes WHERE statut = 'terminee') as chiffre_affaires,
                (SELECT COUNT(*) FROM depenses) as depenses,
                (SELECT SUM(montant) FROM depenses) as total_depenses,
                (SELECT COUNT(*) FROM mouvements_stock WHERE type_mouvement = 'entree') as stocks_entrees,
                (SELECT COUNT(*) FROM mouvements_stock WHERE type_mouvement = 'sortie') as stocks_sorties
            `);
        return stats[0];
    }

    static async getManagerReports(filters = {}) {
        let query = `SELECT 
            DATE(c.date_creation) as date,
            COUNT(*) as nombre_commandes,
            SUM(c.montant_total) as chiffre_affaires,
            (SELECT COUNT(*) FROM depenses WHERE DATE(date_depense) = DATE(c.date_creation)) as depenses_jour,
            (SELECT SUM(montant) FROM depenses WHERE DATE(date_depense) = DATE(c.date_creation)) as total_depenses_jour
            FROM commandes c
            WHERE c.statut = 'terminee'`;
        const params = [];

        if (filters.startDate) {
            query += ' AND c.date_creation >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND c.date_creation <= ?';
            params.push(filters.endDate);
        }

        query += ' GROUP BY DATE(c.date_creation) ORDER BY date DESC';

        const [reports] = await pool.query(query, params);
        return reports;
    }

    static async getTopPerformers() {
        const [performers] = await pool.query(
            `SELECT e.nom as employe_nom, e.poste as poste,
                COUNT(*) as nombre_ventes,
                SUM(c.montant_total) as chiffre_affaires
                FROM employes e
                LEFT JOIN commandes c ON e.id = c.employe_id
                WHERE c.statut = 'terminee'
                GROUP BY e.id
                ORDER BY chiffre_affaires DESC
                LIMIT 5`
        );
        return performers;
    }

    static async getStockAlerts() {
        const [alerts] = await pool.query(
            `SELECT p.*, c.nom as categorie_nom,
                (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id) as stock_actuel
                FROM produits p
                LEFT JOIN categories_produits c ON p.categorie_id = c.id
                WHERE p.stock_min > (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id)
                ORDER BY p.date_peremption ASC
                LIMIT 10`);
        return alerts;
    }

    static async getPendingTasks() {
        const [tasks] = await pool.query(
            `SELECT 
                (SELECT COUNT(*) FROM commandes WHERE statut = 'en_attente') as commandes_en_attente,
                (SELECT COUNT(*) FROM livraisons WHERE statut = 'en_attente') as livraisons_en_attente,
                (SELECT COUNT(*) FROM depenses WHERE statut = 'en_attente') as depenses_en_attente,
                (SELECT COUNT(*) FROM employes WHERE statut = 'en_attente') as employes_en_attente,
                (SELECT COUNT(*) FROM fournisseurs WHERE statut = 'en_attente') as fournisseurs_en_attente
            `);
        return tasks[0];
    }
}

module.exports = Manager;
