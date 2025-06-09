const Dashboard = require('../models/Dashboard');
const { validate } = require('../utils/validators');

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Dashboard.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

exports.getSalesByCategory = async (req, res) => {
    try {
        const sales = await Dashboard.getSalesByCategory(req.query);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des ventes par catégorie' });
    }
};

exports.getDeliveryStats = async (req, res) => {
    try {
        const stats = await Dashboard.getDeliveryStats(req.query);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques de livraison' });
    }
};

exports.getCustomerStats = async (req, res) => {
    try {
        const stats = await Dashboard.getCustomerStats(req.query);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques clients' });
    }
};
