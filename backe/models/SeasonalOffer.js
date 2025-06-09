const pool = require('../config/db');

class SeasonalOffer {
    static async createSeasonalOffer(offerData) {
        const [result] = await pool.query(
            'INSERT INTO offres_saisonniere (nom, description, date_debut, date_fin, ' +
            'type_reduction, pourcentage_reduction, montant_reduction, ' +
            'produits_inclus, categories_incluses, actif) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [offerData.nom, offerData.description, offerData.date_debut, offerData.date_fin,
             offerData.type_reduction, offerData.pourcentage_reduction, offerData.montant_reduction,
             JSON.stringify(offerData.produits_inclus), JSON.stringify(offerData.categories_incluses),
             1]
        );
        return result.insertId;
    }

    static async getSeasonalOfferById(id) {
        const [offers] = await pool.query(
            'SELECT o.*, GROUP_CONCAT(DISTINCT p.nom) as produits_inclus_nom, ' +
            'GROUP_CONCAT(DISTINCT c.nom) as categories_incluses_nom ' +
            'FROM offres_saisonniere o ' +
            'LEFT JOIN produits p ON JSON_CONTAINS(o.produits_inclus, JSON_ARRAY(p.id)) ' +
            'LEFT JOIN categories_produits c ON JSON_CONTAINS(o.categories_incluses, JSON_ARRAY(c.id)) ' +
            'WHERE o.id = ? ' +
            'GROUP BY o.id',
            [id]
        );
        return offers[0];
    }

    static async getActiveSeasonalOffers(filters = {}) {
        let query = 'SELECT o.*, GROUP_CONCAT(DISTINCT p.nom) as produits_inclus_nom, ' +
                   'GROUP_CONCAT(DISTINCT c.nom) as categories_incluses_nom ' +
                   'FROM offres_saisonniere o ' +
                   'LEFT JOIN produits p ON JSON_CONTAINS(o.produits_inclus, JSON_ARRAY(p.id)) ' +
                   'LEFT JOIN categories_produits c ON JSON_CONTAINS(o.categories_incluses, JSON_ARRAY(c.id)) ' +
                   'WHERE o.actif = 1 AND (o.date_fin IS NULL OR o.date_fin >= CURDATE())';
        const params = [];

        if (filters.productId) {
            query += ' AND JSON_CONTAINS(o.produits_inclus, JSON_ARRAY(?))';
            params.push(filters.productId);
        }

        if (filters.categoryId) {
            query += ' AND JSON_CONTAINS(o.categories_incluses, JSON_ARRAY(?))';
            params.push(filters.categoryId);
        }

        query += ' GROUP BY o.id ORDER BY o.date_debut DESC';

        const [offers] = await pool.query(query, params);
        return offers;
    }

    static async updateSeasonalOffer(id, offerData) {
        await pool.query(
            'UPDATE offres_saisonniere SET nom = ?, description = ?, date_debut = ?, ' +
            'date_fin = ?, type_reduction = ?, pourcentage_reduction = ?, montant_reduction = ?, ' +
            'produits_inclus = ?, categories_incluses = ?, actif = ? WHERE id = ?',
            [offerData.nom, offerData.description, offerData.date_debut, offerData.date_fin,
             offerData.type_reduction, offerData.pourcentage_reduction, offerData.montant_reduction,
             JSON.stringify(offerData.produits_inclus), JSON.stringify(offerData.categories_incluses),
             offerData.actif, id]
        );
    }

    static async deleteSeasonalOffer(id) {
        await pool.query('DELETE FROM offres_saisonniere WHERE id = ?', [id]);
    }

    static async applySeasonalOffer(offerId, cartItems) {
        const [offer] = await pool.query(
            'SELECT * FROM offres_saisonniere WHERE id = ? AND actif = 1 ' +
            'AND (date_fin IS NULL OR date_fin >= CURDATE())',
            [offerId]
        );

        if (!offer || !offer.actif) {
            throw new Error('Offre saisonnière non valide ou expirée');
        }

        // Vérifier si les produits du panier sont éligibles
        let eligible = true;
        for (const item of cartItems) {
            if (!JSON.parse(offer.produits_inclus).includes(item.produit_id) &&
                !JSON.parse(offer.categories_incluses).includes(item.categorie_id)) {
                eligible = false;
                break;
            }
        }

        if (!eligible) {
            throw new Error('Certains produits ne sont pas éligibles à cette offre');
        }

        let discountAmount = 0;
        if (offer.type_reduction === 'pourcentage') {
            for (const item of cartItems) {
                discountAmount += (item.prix * item.quantite * offer.pourcentage_reduction) / 100;
            }
        } else if (offer.type_reduction === 'montant') {
            discountAmount = Math.min(offer.montant_reduction, cartItems.reduce((total, item) => 
                total + (item.prix * item.quantite), 0));
        }

        return {
            id: offer.id,
            nom: offer.nom,
            type_reduction: offer.type_reduction,
            amount: discountAmount,
            description: offer.description
        };
    }
}

module.exports = SeasonalOffer;
