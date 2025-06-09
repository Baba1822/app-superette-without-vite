const Promotion = require('../models/Promotion');
const { validate } = require('../utils/validators');

exports.createPromotion = async (req, res) => {
    try {
        const promotionId = await Promotion.createPromotion(req.body);
        res.status(201).json({ id: promotionId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la promotion' });
    }
};

exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.getPromotionById(req.params.id);
        if (!promotion) {
            return res.status(404).json({ error: 'Promotion non trouvée' });
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la promotion' });
    }
};

exports.getActivePromotions = async (req, res) => {
    try {
        const promotions = await Promotion.getActivePromotions(req.query);
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des promotions actives' });
    }
};

exports.updatePromotion = async (req, res) => {
    try {
        await Promotion.updatePromotion(req.params.id, req.body);
        res.json({ message: 'Promotion mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la promotion' });
    }
};

exports.deletePromotion = async (req, res) => {
    try {
        await Promotion.deletePromotion(req.params.id);
        res.json({ message: 'Promotion supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la promotion' });
    }
};

exports.getPromotionHistory = async (req, res) => {
    try {
        const history = await Promotion.getPromotionHistory(req.params.productId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
};

exports.getPromotionsByCategory = async (req, res) => {
    try {
        const promotions = await Promotion.getPromotionsByCategory(req.params.categoryId);
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des promotions' });
    }
};

exports.applyPromotion = async (req, res) => {
    try {
        const discount = await Promotion.applyPromotion(req.params.promotionId, req.body.totalAmount);
        res.json({ discount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
