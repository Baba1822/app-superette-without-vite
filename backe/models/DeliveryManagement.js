const pool = require('../config/db');

class DeliveryManagement {
    static async getDeliveries(filters = {}) {
        let query = `SELECT d.*, cl.nom as client_nom, cl.adresse as client_adresse,
            cl.telephone as client_telephone, e.nom as employe_nom,
            GROUP_CONCAT(DISTINCT p.nom) as produits
            FROM livraisons d
            LEFT JOIN clients cl ON d.client_id = cl.id
            LEFT JOIN employes e ON d.courier_id = e.id
            LEFT JOIN details_livraison dl ON d.id = dl.livraison_id
            LEFT JOIN produits p ON dl.produit_id = p.id
            WHERE 1 = 1`;
        const params = [];

        if (filters.status) {
            query += ' AND d.statut = ?';
            params.push(filters.status);
        }

        if (filters.dateStart) {
            query += ' AND d.date_prevue >= ?';
            params.push(filters.dateStart);
        }

        if (filters.dateEnd) {
            query += ' AND d.date_prevue <= ?';
            params.push(filters.dateEnd);
        }

        if (filters.clientId) {
            query += ' AND d.client_id = ?';
            params.push(filters.clientId);
        }

        query += ' GROUP BY d.id ORDER BY d.date_prevue DESC';

        const [deliveries] = await pool.query(query, params);
        return deliveries;
    }

    static async createDelivery(deliveryData) {
        const [result] = await pool.query(
            'INSERT INTO livraisons (client_id, adresse_livraison, date_prevue, ' +
            'statut, commentaire, courier_id, montant_livraison) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?)',
            [deliveryData.clientId, deliveryData.adresseLivraison, deliveryData.datePrevue,
             'en_attente', deliveryData.commentaire, deliveryData.courierId,
             deliveryData.montantLivraison]
        );
        return result.insertId;
    }

    static async updateDeliveryStatus(deliveryId, status) {
        await pool.query(
            'UPDATE livraisons SET statut = ?, date_statut = NOW() WHERE id = ?',
            [status, deliveryId]
        );
    }

    static async assignCourier(deliveryId, courierId) {
        await pool.query(
            'UPDATE livraisons SET courier_id = ?, date_affectation = NOW() WHERE id = ?',
            [courierId, deliveryId]
        );
    }

    static async addDeliveryDetails(deliveryId, products) {
        for (const product of products) {
            await pool.query(
                'INSERT INTO details_livraison (livraison_id, produit_id, quantite, ' +
                'prix_unitaire, montant_total) VALUES (?, ?, ?, ?, ?)',
                [deliveryId, product.productId, product.quantity, product.price,
                 product.quantity * product.price]
            );
        }
    }

    static async getDeliveryById(id) {
        const [delivery] = await pool.query(
            `SELECT d.*, cl.nom as client_nom, cl.adresse as client_adresse,
                cl.telephone as client_telephone, e.nom as employe_nom,
                GROUP_CONCAT(DISTINCT p.nom) as produits
                FROM livraisons d
                LEFT JOIN clients cl ON d.client_id = cl.id
                LEFT JOIN employes e ON d.courier_id = e.id
                LEFT JOIN details_livraison dl ON d.id = dl.livraison_id
                LEFT JOIN produits p ON dl.produit_id = p.id
                WHERE d.id = ?
                GROUP BY d.id`,
            [id]
        );
        return delivery[0];
    }
}

module.exports = DeliveryManagement;
