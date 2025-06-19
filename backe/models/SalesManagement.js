const pool = require('../config/db');

class SalesManagement {
    static async getAll() {
        try {
            const [sales] = await pool.query('SELECT * FROM sales');
            return sales.map(sale => ({
                id: sale.id,
                date: sale.date,
                clientId: sale.client_id,
                clientName: sale.client_name,
                totalAmount: parseFloat(sale.total_amount) || 0,
                paymentMethod: sale.payment_method,
                status: sale.status,
                notes: sale.notes,
                customerAddress: sale.customer_address,
                customerPhone: sale.customer_phone,
                createdAt: sale.created_at,
                updatedAt: sale.updated_at,
                products: JSON.parse(sale.products_json || '[]')
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération de toutes les ventes:', error);
            throw error;
        }
    }

    static async create(saleData) {
        try {
            // Sécuriser la date : utiliser la date actuelle si absente ou invalide
            let date;
            if (saleData.date) {
                const d = new Date(saleData.date);
                date = (d instanceof Date && !isNaN(d)) ? d.toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');
            } else {
                date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            }

            // Gérer client_id : NULL si 'N/A' ou invalide
            let clientId = null;
            if (saleData.clientId && saleData.clientId !== 'N/A' && !isNaN(saleData.clientId)) {
                clientId = parseInt(saleData.clientId);
            }

            const { clientName, products, totalAmount, paymentMethod, status, notes, customerAddress, customerPhone } = saleData;
            const productsJson = JSON.stringify(products);
            
            const [result] = await pool.query(
                'INSERT INTO sales (date, client_id, client_name, products_json, total_amount, payment_method, status, notes, customer_address, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [date, clientId, clientName, productsJson, totalAmount, paymentMethod, status, notes, customerAddress, customerPhone]
            );
            return { id: result.insertId, ...saleData, date, client_id: clientId };
        } catch (error) {
            console.error('Erreur lors de la création de la vente:', error);
            throw error;
        }
    }

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
