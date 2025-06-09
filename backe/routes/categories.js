const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { createCategory, getCategoryById, getCategories, updateCategory, deleteCategory, getProductsByCategory, getCategoryHierarchy } = require('../controllers/productCategoryController');

// Routes pour les catégories de produits
router.post('/', validate, createCategory);
router.get('/:id', getCategoryById);
router.get('/', getCategories);
router.put('/:id', validate, updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:categoryId/products', getProductsByCategory);
router.get('/hierarchy', getCategoryHierarchy);

module.exports = router;
