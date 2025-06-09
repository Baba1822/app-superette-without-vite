const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier, searchSuppliers } = require('../controllers/supplierController');

// Routes pour les fournisseurs
router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);
router.post('/', validate, createSupplier);
router.put('/:id', validate, updateSupplier);
router.delete('/:id', deleteSupplier);
router.get('/search', searchSuppliers);

module.exports = router;
