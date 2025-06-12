const express = require('express');
const router = express.Router();
const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers
} = require('../controllers/supplierController');

// Routes pour les fournisseurs
router.get('/', getAllSuppliers);
router.get('/search', searchSuppliers);
router.get('/:id', getSupplierById);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;