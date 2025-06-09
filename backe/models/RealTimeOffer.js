const pool = require('../config/db');

class RealTimeOffer {
    static async getPersonalizedOffers(clientId, location = 'in-store') {
        const [offers] = await pool.query(
            'SELECT o.*, c.nom as categorie_nom FROM offres_personnalisees o LEFT JOIN categories c ON o.categorie_id = c.id WHERE o.client_id = ? AND o.location = ?',
            [clientId, location]
        );
        return offers;
    }

    static async generateRecommendations(clientId) {
        const [recommendations] = await pool.query(
            'SELECT p.*, c.nom as categorie_nom FROM recommandations r JOIN produits p ON r.product_id = p.id JOIN categories c ON p.categorie_id = c.id WHERE r.client_id = ?',
            [clientId]
        );
        return recommendations;
    }

    static async getClientProfile(clientId) {
        const [profile] = await pool.query(
            'SELECT * FROM profils_clients WHERE client_id = ?',
            [clientId]
        );
        return profile[0];
    }

    static async trackOfferView(offerId, clientId) {
        await pool.query(
            'INSERT INTO vues_offres (offer_id, client_id, viewed_at) VALUES (?, ?, NOW())',
            [offerId, clientId]
        );
    }
}

module.exports = RealTimeOffer;
