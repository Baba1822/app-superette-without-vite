const Order = require('../models/Order');
const { broadcast } = require('../services/websocketService');

exports.createOrder = async (req, res) => {
    try {
        const order = await Order.createOrder(req.body);
        // Notifier via WebSocket
        broadcast({ type: 'new_sale', data: order });
        res.status(201).json({ id: order.id });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        await Order.updateStatus(req.params.id, req.body.status);
        res.json({ message: 'Statut de la commande mis à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const details = await Order.getDetails(req.params.id);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des détails de la commande' });
    }
};
