const LoyaltyReward = require('../models/LoyaltyReward');
const { validate } = require('../utils/validators');

exports.createReward = async (req, res) => {
    try {
        const rewardId = await LoyaltyReward.createReward(req.body);
        res.status(201).json({ id: rewardId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la récompense' });
    }
};

exports.getRewardById = async (req, res) => {
    try {
        const reward = await LoyaltyReward.getRewardById(req.params.id);
        if (!reward) {
            return res.status(404).json({ error: 'Récompense non trouvée' });
        }
        res.json(reward);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la récompense' });
    }
};

exports.getRewards = async (req, res) => {
    try {
        const rewards = await LoyaltyReward.getRewards(req.query);
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des récompenses' });
    }
};

exports.updateReward = async (req, res) => {
    try {
        await LoyaltyReward.updateReward(req.params.id, req.body);
        res.json({ message: 'Récompense mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la récompense' });
    }
};

exports.deleteReward = async (req, res) => {
    try {
        await LoyaltyReward.deleteReward(req.params.id);
        res.json({ message: 'Récompense supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la récompense' });
    }
};

exports.redeemReward = async (req, res) => {
    try {
        const redemptionId = await LoyaltyReward.redeemReward(
            req.params.rewardId,
            req.body.clientId
        );
        res.json({ id: redemptionId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRedemptionHistory = async (req, res) => {
    try {
        const history = await LoyaltyReward.getRedemptionHistory(req.params.clientId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
};
