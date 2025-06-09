const pool = require('../config/database'); // Utilisez le bon chemin selon votre structure

class AdminDashboard {
    static async getDashboardStats() {
        try {
            const [stats] = await pool.query(
                `SELECT 
                    (SELECT COUNT(*) FROM commandes WHERE statut = 'terminee') as total_ventes,
                    (SELECT COALESCE(SUM(montant_total), 0) FROM commandes WHERE statut = 'terminee') as chiffre_affaires,
                    (SELECT COUNT(*) FROM clients) as total_clients,
                    (SELECT COUNT(*) FROM produits) as total_produits,
                    (SELECT COUNT(*) FROM fournisseurs) as total_fournisseurs,
                    (SELECT COUNT(*) FROM employes) as total_employes,
                    (SELECT COUNT(*) FROM commandes WHERE DATE(date_creation) = CURDATE()) as ventes_jour,
                    (SELECT COALESCE(SUM(montant_total), 0) FROM commandes WHERE DATE(date_creation) = CURDATE()) as chiffre_jour,
                    (SELECT COUNT(*) FROM commandes WHERE statut = 'en_attente') as commandes_en_attente,
                    (SELECT COUNT(*) FROM commandes WHERE statut = 'annulee') as commandes_annulees,
                    (SELECT COUNT(*) FROM mouvements_stock WHERE type_mouvement = 'entree' AND DATE(date_mouvement) = CURDATE()) as stocks_entrees,
                    (SELECT COUNT(*) FROM mouvements_stock WHERE type_mouvement = 'sortie' AND DATE(date_mouvement) = CURDATE()) as stocks_sorties
                `);
            return stats[0] || {};
        } catch (error) {
            console.error('Erreur dans getDashboardStats:', error);
            throw error;
        }
    }

    static async getTopProducts(limit = 5) {
        try {
            const [products] = await pool.query(
                `SELECT p.*, 
                    COALESCE(SUM(dc.quantite), 0) as total_vendu,
                    COALESCE(SUM(dc.quantite * dc.prix_unitaire), 0) as chiffre_affaires_produit
                FROM produits p
                LEFT JOIN details_commande dc ON p.id = dc.produit_id
                LEFT JOIN commandes c ON dc.commande_id = c.id AND c.statut = 'terminee'
                GROUP BY p.id
                ORDER BY total_vendu DESC
                LIMIT ?`,
                [parseInt(limit)]
            );
            return products || [];
        } catch (error) {
            console.error('Erreur dans getTopProducts:', error);
            throw error;
        }
    }

    static async getRecentOrders(limit = 5) {
        try {
            const [orders] = await pool.query(
                `SELECT c.*, 
                    cl.nom as client_nom, 
                    cl.email as client_email,
                    c.montant_total as total_commande
                FROM commandes c
                LEFT JOIN clients cl ON c.client_id = cl.id
                ORDER BY c.date_creation DESC
                LIMIT ?`,
                [parseInt(limit)]
            );
            return orders || [];
        } catch (error) {
            console.error('Erreur dans getRecentOrders:', error);
            throw error;
        }
    }

    static async getStockAlerts() {
        try {
            const [alerts] = await pool.query(
                `SELECT p.*, 
                    c.nom as categorie_nom,
                    p.stock_actuel,
                    (p.stock_min - p.stock_actuel) as stock_manquant
                FROM produits p
                LEFT JOIN categories_produits c ON p.categorie_id = c.id
                WHERE p.stock_actuel <= p.stock_min
                ORDER BY (p.stock_min - p.stock_actuel) DESC
                LIMIT 10`
            );
            return alerts || [];
        } catch (error) {
            console.error('Erreur dans getStockAlerts:', error);
            throw error;
        }
    }

    static async getSalesData() {
        try {
            const [salesData] = await pool.query(
                `SELECT 
                    DATE(date_creation) as date,
                    COUNT(*) as nombre_commandes,
                    COALESCE(SUM(montant_total), 0) as chiffre_affaires_jour
                FROM commandes 
                WHERE statut = 'terminee' 
                    AND date_creation >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY DATE(date_creation)
                ORDER BY date DESC`
            );
            return salesData || [];
        } catch (error) {
            console.error('Erreur dans getSalesData:', error);
            throw error;
        }
    }

    static async getSalesHistory(startDate, endDate) {
        try {
            let query = `SELECT 
                DATE(date_creation) as date,
                COUNT(*) as nombre_commandes,
                COALESCE(SUM(montant_total), 0) as chiffre_affaires_jour
            FROM commandes 
            WHERE statut = 'terminee'`;
            
            const params = [];
            
            if (startDate) {
                query += ` AND date_creation >= ?`;
                params.push(startDate);
            }
            
            if (endDate) {
                query += ` AND date_creation <= ?`;
                params.push(endDate);
            }
            
            query += ` GROUP BY DATE(date_creation) ORDER BY date DESC`;
            
            const [salesHistory] = await pool.query(query, params);
            return salesHistory || [];
        } catch (error) {
            console.error('Erreur dans getSalesHistory:', error);
            throw error;
        }
    }

    static async getClientStats() {
        try {
            const [clientStats] = await pool.query(
                `SELECT 
                    cl.id,
                    cl.nom,
                    cl.email,
                    COUNT(c.id) as nombre_commandes,
                    COALESCE(SUM(c.montant_total), 0) as chiffre_affaires_client,
                    MAX(c.date_creation) as derniere_commande
                FROM clients cl
                LEFT JOIN commandes c ON cl.id = c.client_id AND c.statut = 'terminee'
                GROUP BY cl.id
                ORDER BY chiffre_affaires_client DESC
                LIMIT 10`
            );
            return clientStats || [];
        } catch (error) {
            console.error('Erreur dans getClientStats:', error);
            throw error;
        }
    }
}

module.exports = AdminDashboard;