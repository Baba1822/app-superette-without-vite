const pool = require('../config/database');

class AdminDashboard {
    
    // Récupérer les statistiques générales du dashboard
    static async getDashboardStats() {
        try {
            console.log('AdminDashboard.getDashboardStats - Début');
            
            // Requête pour les statistiques générales
            const statsQuery = `
                SELECT 
                    (SELECT COUNT(*) FROM commandes WHERE statut = 'terminee') as total_ventes,
                    (SELECT COALESCE(SUM(montant_total), 0) FROM commandes WHERE statut = 'terminee') as chiffre_affaires,
                    (SELECT COUNT(*) FROM utilisateurs WHERE type = 'client') as total_clients,
                    (SELECT COUNT(*) FROM produits) as total_produits,
                    (SELECT COUNT(*) FROM commandes WHERE DATE(date_creation) = CURDATE()) as ventes_aujourdhui,
                    (SELECT COUNT(*) FROM produits WHERE stock_actuel <= stock_min) as alertes_stock
            `;
            
            const [statsRows] = await pool.execute(statsQuery);
            const stats = statsRows[0];
            
            console.log('Statistiques récupérées:', stats);
            
            return {
                total_ventes: parseInt(stats.total_ventes) || 0,
                chiffre_affaires: parseFloat(stats.chiffre_affaires) || 0,
                total_clients: parseInt(stats.total_clients) || 0,
                total_produits: parseInt(stats.total_produits) || 0,
                ventes_aujourdhui: parseInt(stats.ventes_aujourdhui) || 0,
                alertes_stock: parseInt(stats.alertes_stock) || 0
            };
            
        } catch (error) {
            console.error('Erreur dans AdminDashboard.getDashboardStats:', error);
            throw error;
        }
    }
    
    // Récupérer les produits les plus vendus
    static async getTopProducts(limit = 5) {
        try {
            console.log('AdminDashboard.getTopProducts - Limite:', limit);
            
            const query = `
                SELECT 
                    p.nom,
                    p.prix,
                    COALESCE(SUM(dc.quantite), 0) as total_vendu,
                    COALESCE(SUM(dc.quantite * dc.prix_unitaire), 0) as chiffre_affaires_produit
                FROM produits p
                LEFT JOIN details_commande dc ON p.id = dc.produit_id
                LEFT JOIN commandes c ON dc.commande_id = c.id
                WHERE c.statut = 'terminee'
                GROUP BY p.id, p.nom, p.prix
                ORDER BY total_vendu DESC
                LIMIT ?
            `;
            
            const [rows] = await pool.execute(query, [limit]);
            
            console.log(`Top ${limit} produits récupérés:`, rows.length);
            
            return rows.map(row => ({
                nom: row.nom,
                prix: parseFloat(row.prix),
                total_vendu: parseInt(row.total_vendu) || 0,
                chiffre_affaires_produit: parseFloat(row.chiffre_affaires_produit) || 0
            }));
            
        } catch (error) {
            console.error('Erreur dans AdminDashboard.getTopProducts:', error);
            throw error;
        }
    }
    
    // Récupérer les commandes récentes
    static async getRecentOrders(limit = 5) {
        try {
            console.log('AdminDashboard.getRecentOrders - Limite:', limit);
            
            const query = `
                SELECT 
                    c.id,
                    c.numero_commande,
                    c.date_creation,
                    c.montant_total as total,
                    c.statut,
                    u.nom as client_nom,
                    u.prenom as client_prenom
                FROM commandes c
                LEFT JOIN utilisateurs u ON c.client_id = u.id
                ORDER BY c.date_creation DESC
                LIMIT ?
            `;
            
            const [rows] = await pool.execute(query, [limit]);
            
            console.log(`${limit} commandes récentes récupérées:`, rows.length);
            
            return rows.map(row => ({
                id: row.id,
                numero_commande: row.numero_commande,
                date_creation: row.date_creation,
                total: parseFloat(row.total),
                statut: row.statut,
                client_nom: row.client_nom,
                client_prenom: row.client_prenom
            }));
            
        } catch (error) {
            console.error('Erreur dans AdminDashboard.getRecentOrders:', error);
            throw error;
        }
    }
    
    // Récupérer les alertes de stock
    static async getStockAlerts() {
        try {
            console.log('AdminDashboard.getStockAlerts - Début');
            
            const query = `
                SELECT 
                    id,
                    nom,
                    stock_actuel,
                    stock_min,
                    prix
                FROM produits 
                WHERE stock_actuel <= stock_min
                ORDER BY stock_actuel ASC
                LIMIT 20
            `;
            
            const [rows] = await pool.execute(query);
            
            console.log('Alertes de stock récupérées:', rows.length);
            
            return rows.map(row => ({
                id: row.id,
                nom: row.nom,
                stock_actuel: parseInt(row.stock_actuel),
                stock_min: parseInt(row.stock_min),
                prix: parseFloat(row.prix)
            }));
            
        } catch (error) {
            console.error('Erreur dans AdminDashboard.getStockAlerts:', error);
            throw error;
        }
    }
    
    // Récupérer les données de ventes pour les graphiques
    static async getSalesData() {
        try {
            console.log('AdminDashboard.getSalesData - Début');
            
            const query = `
                SELECT 
                    DATE(date_creation) as date,
                    COUNT(*) as nombre_commandes,
                    COALESCE(SUM(montant_total), 0) as chiffre_affaires_jour
                FROM commandes 
                WHERE statut = 'terminee' 
                AND date_creation >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY DATE(date_creation)
                ORDER BY date DESC
            `;
            
            const [rows] = await pool.execute(query);
            
            console.log('Données de ventes récupérées:', rows.length);
            
            return rows.map(row => ({
                date: row.date,
                nombre_commandes: parseInt(row.nombre_commandes),
                chiffre_affaires_jour: parseFloat(row.chiffre_affaires_jour)
            }));
            
        } catch (error) {
            console.error('Erreur dans AdminDashboard.getSalesData:', error);
            throw error;
        }
    }
    
    // Récupérer l'historique des ventes avec filtres de date
    static async getSalesHistory(startDate = null, endDate = null) {
        try {
            console.log('AdminDashboard.getSalesHistory - Dates:', { startDate, endDate });
            
            let query = `
                SELECT 
                    DATE(date_creation) as date,
                    COUNT(*) as nombre_commandes,
                    COALESCE(SUM(montant_total), 0) as chiffre_affaires_jour
                FROM commandes 
                WHERE statut = 'terminee'
            `;
            
            const params = [];
            
            if (startDate) {
                query += ' AND date_creation >= ?';
                params.push(startDate);
            }
            
            if (endDate) {
                query += ' AND date_creation <= ?';
                params.push(endDate);
            }
            
            if (!startDate && !endDate) {
                query += ' AND date_creation >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
            }
            
            query += ' GROUP BY DATE(date_creation) ORDER BY date DESC';
            
            const [rows] = await pool.execute(query, params);
            
            console.log('Historique des ventes récupéré:', rows.length);
            
            return rows.map(row => ({
                date: row.date,
                nombre_commandes: parseInt(row.nombre_commandes),
                chiffre_affaires_jour: parseFloat(row.chiffre_affaires_jour)
            }));
            
        } catch (error) {
            console.error('Erreur dans AdminDashboard.getSalesHistory:', error);
            throw error;
        }
    }
    
    // Récupérer les statistiques des clients
    static async getClientStats() {
        try {
            console.log('AdminDashboard.getClientStats - Début');
            
            const query = `
                SELECT 
                    c.id,
                    c.nom,
                    c.prenom,
                    c.email,
                    COUNT(co.id) as nombre_commandes,
                    COALESCE(SUM(co.montant_total), 0) as total_achats,
                    MAX(co.date_creation) as derniere_commande
                FROM clients c
                LEFT JOIN commandes co ON c.id = co.client_id AND co.statut = 'terminee'
                GROUP BY c.id, c.nom, c.prenom, c.email
                ORDER BY total_achats DESC
                LIMIT 10
            `;
            
            const [rows] = await pool.execute(query);
            
            console.log('Statistiques clients récupérées:', rows.length);
            
            return rows.map(row => ({
                id: row.id,
                nom: row.nom,
                prenom: row.prenom,
                email: row.email,
                nombre_commandes: parseInt(row.nombre_commandes) || 0,
                total_achats: parseFloat(row.total_achats) || 0,
                derniere_commande: row.derniere_commande
            }));
            
        } catch (error) {
            console.error('Erreur dans AdminDashboard.getClientStats:', error);
            throw error;
        }
    }
}

module.exports = AdminDashboard;