const Loyalty = require('../models/Loyalty');
const { validate } = require('../utils/validators');

exports.getClientLoyalty = async (req, res) => {
    try {
        const loyalty = await Loyalty.getClientLoyalty(req.params.clientId);
        res.json(loyalty);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du statut de fidélité' });
    }
};

exports.getAvailableRewards = async (req, res) => {
    try {
        const rewards = await Loyalty.getAvailableRewards(req.params.clientId);
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des récompenses disponibles' });
    }
};

exports.getRecentTransactions = async (req, res) => {
    try {
        const transactions = await Loyalty.getRecentTransactions(req.params.clientId, req.query.limit);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des transactions récentes' });
    }
};

exports.redeemReward = async (req, res) => {
    try {
        const result = await Loyalty.redeemReward(req.params.clientId, req.body.rewardId);
        res.json({ success: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
