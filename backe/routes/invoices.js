const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getInvoices, createInvoice, updateInvoiceStatus, getInvoiceById, generateInvoicePDF } = require('../controllers/invoicesController');

// Routes pour les factures
router.get('/', getInvoices);
router.post('/', validate, createInvoice);
router.put('/:invoiceId/status', validate, updateInvoiceStatus);
router.get('/:invoiceId', getInvoiceById);
router.get('/:invoiceId/pdf', generateInvoicePDF);

module.exports = router;
