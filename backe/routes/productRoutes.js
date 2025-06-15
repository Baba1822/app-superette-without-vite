const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/multer');
const { check } = require('express-validator');

// Validation rules
const productValidationRules = [
  check('nom').trim().notEmpty().withMessage('Le nom est requis'),
  check('prix').isFloat({ gt: 0 }).withMessage('Le prix doit être un nombre positif'),
  check('stock').isInt({ min: 0 }).withMessage('Le stock doit être un entier positif'),
  check('categorie_id').isInt({ gt: 0 }).withMessage('Catégorie invalide'),
  check('description').optional().trim(),
  check('saison').optional().isBoolean(),
  check('promotion').optional().isBoolean(),
  check('type_promotion').optional().isIn(['percentage', 'fixed']),
  check('valeur_promotion').optional().isFloat({ min: 0 }),
  check('date_debut_saison').optional().isISO8601(),
  check('date_fin_saison').optional().isISO8601(),
  check('date_debut_promo').optional().isISO8601(),
  check('date_fin_promo').optional().isISO8601(),
  check('date_peremption').optional().isISO8601()
];

// Routes
router.get('/', productController.getAllProducts);
router.get('/promotions', productController.getPromotionalProducts);
router.get('/seasonal', productController.getSeasonalProducts);
router.get('/low-stock', authMiddleware, productController.getLowStockProducts);

router.get('/:id', productController.getProductById);

router.post(
  '/',
  authMiddleware,
  productValidationRules,
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  productValidationRules,
  productController.updateProduct
);

router.delete('/:id', authMiddleware, productController.deleteProduct);

router.post(
  '/upload-image/:id',
  authMiddleware,
  upload.single('image'),
  productController.uploadImage
);

module.exports = router;