const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getInventory, getStockMovements, getInventoryValue, getStockAlerts } = require('../controllers/inventoryController');

// Routes pour l'inventaire
router.get('/', getInventory);
router.get('/movements/:productId', getStockMovements);
router.get('/value', getInventoryValue);
router.get('/alerts', getStockAlerts);

module.exports = router;
