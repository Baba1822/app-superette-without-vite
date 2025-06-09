const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const orderId = await Order.create(req.body);
        res.status(201).json({ id: orderId });
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
