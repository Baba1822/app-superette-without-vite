const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { 
    getSalesReport, getSalesStatistics, getTopSellingProducts, 
    getSalesByCategory
} = require('../controllers/salesManagementController');

// Routes pour la gestion des ventes
router.get('/report', getSalesReport);
router.get('/statistics', getSalesStatistics);
router.get('/top-products', getTopSellingProducts);
router.get('/by-category', getSalesByCategory);

module.exports = router;
