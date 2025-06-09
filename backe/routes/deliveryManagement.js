const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { 
    getDeliveries, createDelivery, updateDeliveryStatus, 
    assignCourier, getDeliveryById
} = require('../controllers/deliveryManagementController');

// Routes pour la gestion des livraisons
router.get('/', getDeliveries);
router.post('/', validate, createDelivery);
router.put('/:deliveryId/status', validate, updateDeliveryStatus);
router.put('/:deliveryId/courier', validate, assignCourier);
router.get('/:deliveryId', getDeliveryById);

module.exports = router;
