const pool = require('../config/db');

class ClientOrders {
    static async getClientOrders(clientId, filters = {}) {
        let query = `SELECT o.*, 
            GROUP_CONCAT(DISTINCT p.nom) as produits,
            SUM(di.montant_total) as total_commande,
            e.nom as employe_nom,
            e.poste as employe_poste
            FROM commandes o
            LEFT JOIN details_commande di ON o.id = di.commande_id
            LEFT JOIN produits p ON di.produit_id = p.id
            LEFT JOIN employes e ON o.employe_id = e.id
            WHERE o.client_id = ?`;
        const params = [clientId];

        if (filters.status) {
            query += ' AND o.statut = ?';
            params.push(filters.status);
        }

        if (filters.startDate) {
            query += ' AND o.date_creation >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND o.date_creation <= ?';
            params.push(filters.endDate);
        }

        query += ' GROUP BY o.id ORDER BY o.date_creation DESC';

        const [orders] = await pool.query(query, params);
        return orders;
    }

    static async getOrderDetails(orderId) {
        const [order] = await pool.query(
            `SELECT o.*, c.nom as client_nom, c.telephone as client_telephone,
                GROUP_CONCAT(DISTINCT p.nom) as produits,
                SUM(di.montant_total) as total_commande,
                e.nom as employe_nom, e.poste as employe_poste,
                GROUP_CONCAT(DISTINCT p.id) as produit_ids,
                GROUP_CONCAT(DISTINCT di.quantite) as quantites,
                GROUP_CONCAT(DISTINCT di.prix_unitaire) as prix_unitaires
                FROM commandes o
                LEFT JOIN clients c ON o.client_id = c.id
                LEFT JOIN details_commande di ON o.id = di.commande_id
                LEFT JOIN produits p ON di.produit_id = p.id
                LEFT JOIN employes e ON o.employe_id = e.id
                WHERE o.id = ?
                GROUP BY o.id`,
            [orderId]
        );
        return order[0];
    }

    static async getRecentOrders(clientId, limit = 5) {
        const [orders] = await pool.query(
            `SELECT o.*, 
                GROUP_CONCAT(DISTINCT p.nom) as produits,
                SUM(di.montant_total) as total_commande,
                e.nom as employe_nom
                FROM commandes o
                LEFT JOIN details_commande di ON o.id = di.commande_id
                LEFT JOIN produits p ON di.produit_id = p.id
                LEFT JOIN employes e ON o.employe_id = e.id
                WHERE o.client_id = ? AND o.statut = 'terminee'
                GROUP BY o.id
                ORDER BY o.date_creation DESC
                LIMIT ?`,
            [clientId, limit]
        );
        return orders;
    }

    static async getMonthlyStats(clientId) {
        const [stats] = await pool.query(
            `SELECT 
                COUNT(*) as nombre_commandes,
                SUM(montant_total) as total_depenses,
                AVG(montant_total) as moyenne_commande,
                MAX(montant_total) as plus_grande_commande
                FROM commandes
                WHERE client_id = ? 
                AND date_creation >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`,
            [clientId]
        );
        return stats[0];
    }
}

module.exports = ClientOrders;
