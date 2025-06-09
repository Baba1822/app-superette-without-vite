const AdminDashboard = require('../models/AdminDashboard');
const { validate } = require('../utils/validators');

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await AdminDashboard.getDashboardStats();
        res.json(stats);
    } catch (error) {
        console.error('Erreur getDashboardStats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        // Assurer que le limit est un nombre valide
        const limitParam = req.query.limit;
        let limit = 5; // Valeur par défaut
        
        if (limitParam) {
            // Vérifier si c'est un nombre
            if (typeof limitParam === 'number') {
                limit = limitParam;
            } else if (typeof limitParam === 'string') {
                const parsed = parseInt(limitParam);
                if (!isNaN(parsed)) {
                    limit = parsed;
                }
            }
            
            // Vérifier que le limit est valide
            if (limit <= 0) {
                return res.status(400).json({ error: 'Le paramètre limit doit être un nombre positif' });
            }
        }
        
        const products = await AdminDashboard.getTopProducts(limit);
        res.json(products);
    } catch (error) {
        console.error('Erreur getTopProducts:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits les plus vendus' });
    }
};

exports.getRecentOrders = async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const orders = await AdminDashboard.getRecentOrders(limit);
        res.json(orders);
    } catch (error) {
        console.error('Erreur getRecentOrders:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes récentes' });
    }
};

exports.getStockAlerts = async (req, res) => {
    try {
        const alerts = await AdminDashboard.getStockAlerts();
        res.json(alerts);
    } catch (error) {
        console.error('Erreur getStockAlerts:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des alertes de stock' });
    }
};

exports.getSalesData = async (req, res) => {
    try {
        const salesData = await AdminDashboard.getSalesData();
        res.json(salesData);
    } catch (error) {
        console.error('Erreur getSalesData:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données de ventes' });
    }
};

exports.getSalesHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const salesHistory = await AdminDashboard.getSalesHistory(startDate, endDate);
        res.json(salesHistory);
    } catch (error) {
        console.error('Erreur getSalesHistory:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des ventes' });
    }
};

exports.getClientStats = async (req, res) => {
    try {
        const clientStats = await AdminDashboard.getClientStats();
        res.json(clientStats);
    } catch (error) {
        console.error('Erreur getClientStats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques des clients' });
    }
};