const pool = require('../config/db');

class Client {
    static async createClient(clientData) {
        const [result] = await pool.query(
            'INSERT INTO clients (nom, prenom, email, telephone, date_naissance, genre, ' +
            'adresse, ville, pays, code_postal, type_client, status, date_inscription) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [clientData.nom, clientData.prenom, clientData.email, clientData.telephone,
             clientData.date_naissance, clientData.genre, clientData.adresse,
             clientData.ville, clientData.pays, clientData.code_postal,
             clientData.type_client, 'actif']
        );
        return result.insertId;
    }

    static async getClientById(id) {
        const [clients] = await pool.query(
            'SELECT c.*, COUNT(a.id) as adresse_count, COUNT(p.id) as point_count ' +
            'FROM clients c ' +
            'LEFT JOIN adresses_client a ON c.id = a.client_id ' +
            'LEFT JOIN points_fidelite p ON c.id = p.client_id ' +
            'WHERE c.id = ? ' +
            'GROUP BY c.id',
            [id]
        );
        return clients[0];
    }

    static async getClients(filters = {}) {
        let query = 'SELECT c.*, COUNT(a.id) as adresse_count, COUNT(p.id) as point_count ' +
                   'FROM clients c ' +
                   'LEFT JOIN adresses_client a ON c.id = a.client_id ' +
                   'LEFT JOIN points_fidelite p ON c.id = p.client_id';
        const params = [];

        if (filters.email) {
            query += ' WHERE c.email = ?';
            params.push(filters.email);
        }

        if (filters.ville) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' c.ville = ?';
            params.push(filters.ville);
        }

        if (filters.typeClient) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' c.type_client = ?';
            params.push(filters.typeClient);
        }

        query += ' GROUP BY c.id ORDER BY c.date_inscription DESC';

        const [clients] = await pool.query(query, params);
        return clients;
    }

    static async updateClient(id, clientData) {
        await pool.query(
            'UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ?, date_naissance = ?, ' +
            'genre = ?, adresse = ?, ville = ?, pays = ?, code_postal = ?, type_client = ?, status = ? ' +
            'WHERE id = ?',
            [clientData.nom, clientData.prenom, clientData.email, clientData.telephone,
             clientData.date_naissance, clientData.genre, clientData.adresse,
             clientData.ville, clientData.pays, clientData.code_postal,
             clientData.type_client, clientData.status, id]
        );
    }

    static async deleteClient(id) {
        // Supprimer les adresses associées
        await pool.query('DELETE FROM adresses_client WHERE client_id = ?', [id]);
        
        // Supprimer les points de fidélité
        await pool.query('DELETE FROM points_fidelite WHERE client_id = ?', [id]);
        
        // Supprimer les commandes associées
        await pool.query('DELETE FROM commandes WHERE client_id = ?', [id]);
        
        // Supprimer le client
        await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    }

    static async addAddress(clientId, addressData) {
        const [result] = await pool.query(
            'INSERT INTO adresses_client (client_id, adresse, ville, pays, code_postal, type_adresse) ' +
            'VALUES (?, ?, ?, ?, ?, ?)',
            [clientId, addressData.adresse, addressData.ville, addressData.pays,
             addressData.code_postal, addressData.type_adresse]
        );
        return result.insertId;
    }

    static async getAddresses(clientId) {
        const [addresses] = await pool.query(
            'SELECT * FROM adresses_client WHERE client_id = ? ORDER BY type_adresse',
            [clientId]
        );
        return addresses;
    }

    static async updateAddress(addressId, addressData) {
        await pool.query(
            'UPDATE adresses_client SET adresse = ?, ville = ?, pays = ?, code_postal = ?, type_adresse = ? ' +
            'WHERE id = ?',
            [addressData.adresse, addressData.ville, addressData.pays,
             addressData.code_postal, addressData.type_adresse, addressId]
        );
    }

    static async deleteAddress(addressId) {
        await pool.query('DELETE FROM adresses_client WHERE id = ?', [addressId]);
    }

    static async getPurchaseHistory(clientId, filters = {}) {
        let query = 'SELECT c.*, p.* ' +
                   'FROM commandes c ' +
                   'LEFT JOIN produits p ON c.produit_id = p.id ' +
                   'WHERE c.client_id = ?';
        const params = [clientId];

        if (filters.startDate) {
            query += ' AND c.date_commande >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND c.date_commande <= ?';
            params.push(filters.endDate);
        }

        query += ' ORDER BY c.date_commande DESC';

        const [history] = await pool.query(query, params);
        return history;
    }

    static async getLoyaltyPoints(clientId) {
        const [points] = await pool.query(
            'SELECT SUM(points) as total_points, COUNT(*) as operations_count ' +
            'FROM points_fidelite ' +
            'WHERE client_id = ?',
            [clientId]
        );
        return points[0];
    }

    static async addLoyaltyPoints(clientId, pointsData) {
        const [result] = await pool.query(
            'INSERT INTO points_fidelite (client_id, points, type, description, date_ajout) ' +
            'VALUES (?, ?, ?, ?, NOW())',
            [clientId, pointsData.points, pointsData.type, pointsData.description]
        );
        return result.insertId;
    }

    static async getClientPreferences(clientId) {
        const [preferences] = await pool.query(
            'SELECT * FROM preferences_client WHERE client_id = ?',
            [clientId]
        );
        return preferences;
    }

    static async updateClientPreferences(clientId, preferencesData) {
        await pool.query(
            'INSERT INTO preferences_client (client_id, preference_type, valeur) ' +
            'VALUES (?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE valeur = ?',
            [clientId, preferencesData.preference_type, preferencesData.valeur, preferencesData.valeur]
        );
    }

    static async getClientStatistics(clientId) {
        const [stats] = await pool.query(
            'SELECT ' +
            '(SELECT COUNT(*) FROM commandes WHERE client_id = ?) as total_orders, ' +
            '(SELECT SUM(montant) FROM commandes WHERE client_id = ?) as total_spent, ' +
            '(SELECT AVG(montant) FROM commandes WHERE client_id = ?) as average_order, ' +
            '(SELECT COUNT(DISTINCT DATE(date_commande)) FROM commandes WHERE client_id = ?) as days_active',
            [clientId, clientId, clientId, clientId]
        );
        return stats[0];
    }
}

module.exports = Client;
