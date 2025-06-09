const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { createDelivery, getDeliveryById, getDeliveries, updateDeliveryStatus, assignToCourier, completeDelivery } = require('../controllers/deliveryController');

// Routes pour les livraisons
router.post('/', validate, createDelivery);
router.get('/:id', getDeliveryById);
router.get('/', getDeliveries);
router.put('/:id/status', validate, updateDeliveryStatus);
router.put('/:id/courier', validate, assignToCourier);
router.put('/:id/complete', validate, completeDelivery);

module.exports = router;
