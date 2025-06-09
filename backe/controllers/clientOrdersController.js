const ClientOrders = require('../models/ClientOrders');
const { validate } = require('../utils/validators');

exports.getClientOrders = async (req, res) => {
    try {
        const orders = await ClientOrders.getClientOrders(req.params.clientId, req.query);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const order = await ClientOrders.getOrderDetails(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des détails de la commande' });
    }
};

exports.getRecentOrders = async (req, res) => {
    try {
        const orders = await ClientOrders.getRecentOrders(req.params.clientId, req.query.limit);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes récentes' });
    }
};

exports.getMonthlyStats = async (req, res) => {
    try {
        const stats = await ClientOrders.getMonthlyStats(req.params.clientId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques mensuelles' });
    }
};
