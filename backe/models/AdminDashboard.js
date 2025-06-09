const pool = require('../config/db');

class AdminDashboard {
    static async getDashboardStats() {
        const [stats] = await pool.query(
            `SELECT 
                (SELECT COUNT(*) FROM commandes WHERE statut = 'terminee') as total_ventes,
                (SELECT SUM(montant_total) FROM commandes WHERE statut = 'terminee') as chiffre_affaires,
                (SELECT COUNT(*) FROM clients) as total_clients,
                (SELECT COUNT(*) FROM produits) as total_produits,
                (SELECT COUNT(*) FROM fournisseurs) as total_fournisseurs,
                (SELECT COUNT(*) FROM employes) as total_employes,
                (SELECT COUNT(*) FROM commandes WHERE DATE(date_creation) = CURDATE()) as ventes_jour,
                (SELECT SUM(montant_total) FROM commandes WHERE DATE(date_creation) = CURDATE()) as chiffre_jour,
                (SELECT COUNT(*) FROM commandes WHERE statut = 'en_attente') as commandes_en_attente,
                (SELECT COUNT(*) FROM commandes WHERE statut = 'annulee') as commandes_annulees,
                (SELECT COUNT(*) FROM mouvements_stock WHERE type_mouvement = 'entree' AND DATE(date_mouvement) = CURDATE()) as stocks_entrees,
                (SELECT COUNT(*) FROM mouvements_stock WHERE type_mouvement = 'sortie' AND DATE(date_mouvement) = CURDATE()) as stocks_sorties
            `);
        return stats[0];
    }

    static async getTopProducts(limit = 5) {
        const [products] = await pool.query(
            `SELECT p.*, SUM(dc.quantite) as total_vendu
            FROM produits p
            LEFT JOIN details_commande dc ON p.id = dc.produit_id
            WHERE dc.commande_id IN (SELECT id FROM commandes WHERE statut = 'terminee')
            GROUP BY p.id
            ORDER BY total_vendu DESC
            LIMIT ?`,
            [limit]
        );
        return products;
    }

    static async getRecentOrders(limit = 5) {
        const [orders] = await pool.query(
            `SELECT c.*, cl.nom as client_nom, cl.email as client_email,
                SUM(dc.montant_total) as total_commande
            FROM commandes c
            LEFT JOIN clients cl ON c.client_id = cl.id
            LEFT JOIN details_commande dc ON c.id = dc.commande_id
            WHERE c.statut = 'terminee'
            GROUP BY c.id
            ORDER BY c.date_creation DESC
            LIMIT ?`,
            [limit]
        );
        return orders;
    }

    static async getStockAlerts() {
        const [alerts] = await pool.query(
            `SELECT p.*, c.nom as categorie_nom,
                (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id) as stock_actuel
            FROM produits p
            LEFT JOIN categories_produits c ON p.categorie_id = c.id
            WHERE p.stock_min > (SELECT SUM(quantite) FROM mouvements_stock WHERE produit_id = p.id)
            ORDER BY p.date_peremption ASC
            LIMIT 10`
        );
        return alerts;
    }
}

module.exports = AdminDashboard;
