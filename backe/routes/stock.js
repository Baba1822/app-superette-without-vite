const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { checkStockLevels, scheduleStockCheck, getNotifications, createNotification, createMovement, getMovements, getCurrentStock, updateProductStock } = require('../controllers/stockMovementController');

// Routes pour les notifications de stock
router.get('/levels', (req, res) => {
    checkStockLevels().then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});
router.post('/schedule-check', validate, (req, res) => {
    scheduleStockCheck(req.body).then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});
router.get('/notifications', (req, res) => {
    getNotifications().then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});
router.post('/notifications', validate, (req, res) => {
    createNotification(req.body).then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});

// Routes pour les mouvements de stock
router.post('/movements', validate, (req, res) => {
    createMovement(req.body).then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});
router.get('/movements', (req, res) => {
    getMovements().then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});
router.get('/products/:productId', (req, res) => {
    getCurrentStock(req.params.productId).then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});
router.put('/products/:productId', validate, (req, res) => {
    updateProductStock(req.params.productId, req.body).then(result => res.json(result))
        .catch(error => res.status(500).json({ error: error.message }));
});

module.exports = router;
