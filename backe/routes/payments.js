const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { createPayment, getPaymentById, getPayments, updatePaymentStatus, createInstallment, updateInstallmentStatus, getInstallments } = require('../controllers/paymentController');

// Routes pour les paiements
router.post('/', validate, createPayment);
router.get('/:id', getPaymentById);
router.get('/', getPayments);
router.put('/:id/status', validate, updatePaymentStatus);
router.post('/:paymentId/installments', validate, createInstallment);
router.put('/installments/:id/status', validate, updateInstallmentStatus);
router.get('/:paymentId/installments', getInstallments);

module.exports = router;
