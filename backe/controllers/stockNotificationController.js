const StockNotification = require('../models/StockNotification');
const { validate } = require('../utils/validators');

exports.checkStockLevels = async (req, res) => {
    try {
        const lowStockProducts = await StockNotification.checkStockLevels();
        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la vérification des stocks' });
    }
};

exports.scheduleStockCheck = async (req, res) => {
    try {
        await StockNotification.scheduleCheck();
        res.json({ message: 'Vérification des stocks planifiée' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la planification de la vérification' });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await StockNotification.getNotifications();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const notificationId = await StockNotification.createNotification(
            req.body.productId,
            req.body.supplierId,
            req.body.message
        );
        res.status(201).json({ id: notificationId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la notification' });
    }
};
