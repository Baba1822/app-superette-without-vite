const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getManagerStats, getManagerReports, getTopPerformers, getStockAlerts, getPendingTasks } = require('../controllers/managerController');

// Routes pour le gestionnaire
router.get('/stats', getManagerStats);
router.get('/reports', getManagerReports);
router.get('/top-performers', getTopPerformers);
router.get('/stock-alerts', getStockAlerts);
router.get('/pending-tasks', getPendingTasks);

module.exports = router;
