const Discount = require('../models/Discount');
const SeasonalOffer = require('../models/SeasonalOffer');
const { validate } = require('../utils/validators');

// Gestion des remises
exports.createDiscount = async (req, res) => {
    try {
        const discountId = await Discount.createDiscount(req.body);
        res.status(201).json({ id: discountId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la remise' });
    }
};

exports.getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.getDiscountById(req.params.id);
        if (!discount) {
            return res.status(404).json({ error: 'Remise non trouvée' });
        }
        res.json(discount);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la remise' });
    }
};

exports.getActiveDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.getActiveDiscounts(req.query);
        res.json(discounts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des remises actives' });
    }
};

exports.updateDiscount = async (req, res) => {
    try {
        await Discount.updateDiscount(req.params.id, req.body);
        res.json({ message: 'Remise mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la remise' });
    }
};

exports.deleteDiscount = async (req, res) => {
    try {
        await Discount.deleteDiscount(req.params.id);
        res.json({ message: 'Remise supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la remise' });
    }
};

exports.applyDiscount = async (req, res) => {
    try {
        const discount = await Discount.applyDiscount(req.params.discountId, req.body.amount);
        res.json(discount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Gestion des offres saisonnières
exports.createSeasonalOffer = async (req, res) => {
    try {
        const offerId = await SeasonalOffer.createSeasonalOffer(req.body);
        res.status(201).json({ id: offerId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'offre saisonnière' });
    }
};

exports.getSeasonalOfferById = async (req, res) => {
    try {
        const offer = await SeasonalOffer.getSeasonalOfferById(req.params.id);
        if (!offer) {
            return res.status(404).json({ error: 'Offre saisonnière non trouvée' });
        }
        res.json(offer);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'offre saisonnière' });
    }
};

exports.getActiveSeasonalOffers = async (req, res) => {
    try {
        const offers = await SeasonalOffer.getActiveSeasonalOffers(req.query);
        res.json(offers);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des offres saisonnières actives' });
    }
};

exports.updateSeasonalOffer = async (req, res) => {
    try {
        await SeasonalOffer.updateSeasonalOffer(req.params.id, req.body);
        res.json({ message: 'Offre saisonnière mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'offre saisonnière' });
    }
};

exports.deleteSeasonalOffer = async (req, res) => {
    try {
        await SeasonalOffer.deleteSeasonalOffer(req.params.id);
        res.json({ message: 'Offre saisonnière supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'offre saisonnière' });
    }
};

exports.applySeasonalOffer = async (req, res) => {
    try {
        const offer = await SeasonalOffer.applySeasonalOffer(req.params.offerId, req.body.cartItems);
        res.json(offer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
