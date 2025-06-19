const SalesManagement = require('../models/SalesManagement');
const { validate } = require('../utils/validators');

exports.getAllSales = async (req, res) => {
    try {
        const sales = await SalesManagement.getAll();
        console.log('Ventes récupérées du modèle:', sales);
        if (sales.length > 0) {
            console.log('Première vente:', {
                id: sales[0].id,
                date: sales[0].date,
                totalAmount: sales[0].totalAmount,
                products: sales[0].products
            });
        }
        res.json(sales);
    } catch (error) {
        console.error('Erreur lors de la récupération des ventes:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des ventes' });
    }
};

exports.createSale = async (req, res) => {
    try {
        // Vous pouvez ajouter ici une validation des données si nécessaire
        const newSale = await SalesManagement.create(req.body);
        res.status(201).json(newSale);
    } catch (error) {
        console.error('Erreur lors de la création de la vente:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la vente' });
    }
};

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
