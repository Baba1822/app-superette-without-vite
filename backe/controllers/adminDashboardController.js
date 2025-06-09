const AdminDashboard = require('../models/AdminDashboard');
const { validate } = require('../utils/validators');

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await AdminDashboard.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const products = await AdminDashboard.getTopProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits les plus vendus' });
    }
};

exports.getRecentOrders = async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const orders = await AdminDashboard.getRecentOrders(limit);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes récentes' });
    }
};

exports.getStockAlerts = async (req, res) => {
    try {
        const alerts = await AdminDashboard.getStockAlerts();
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des alertes de stock' });
    }
};
