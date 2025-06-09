const SalesManagement = require('../models/SalesManagement');
const { validate } = require('../utils/validators');

exports.getSalesReport = async (req, res) => {
    try {
        const sales = await SalesManagement.getSalesReport(req.query);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du rapport des ventes' });
    }
};

exports.getSalesStatistics = async (req, res) => {
    try {
        const stats = await SalesManagement.getSalesStatistics(req.query);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

exports.getTopSellingProducts = async (req, res) => {
    try {
        const products = await SalesManagement.getTopSellingProducts(req.query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits les plus vendus' });
    }
};

exports.getSalesByCategory = async (req, res) => {
    try {
        const categories = await SalesManagement.getSalesByCategory(req.query);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des ventes par catégorie' });
    }
};
