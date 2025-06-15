const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Routes publiquesrouter.post('/register', customerController.register);
router.post('/login', customerController.login);

// Routes protégées
router.use(customerController.verifyToken);
router.use(customerController.isClient);
router.use(customerController.isCustomer);

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.get('/email/:email', customerController.getCustomerByEmail);
router.put('/:id', customerController.updateCustomer);
router.put('/:id/status', customerController.updateCustomerStatus);
router.get('/:id/history', customerController.getPurchaseHistory);
router.get('/:id/points', customerController.getLoyaltyPoints);
router.post('/:id/points', customerController.addLoyaltyPoints);
router.get('/:id/stats', customerController.getCustomerStats);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
