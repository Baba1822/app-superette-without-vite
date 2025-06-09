const { body, validationResult } = require('express-validator');

// Validation pour l'inscription
exports.registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Veuillez entrer une adresse email valide'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom est requis'),
    body('prenom')
        .trim()
        .notEmpty()
        .withMessage('Le prénom est requis'),
    body('role')
        .isIn(['admin', 'caissier', 'stockist'])
        .withMessage('Le rôle n\'est pas valide')
];

// Validation pour la connexion
exports.loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Veuillez entrer une adresse email valide'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Le mot de passe est requis')
];

// Validation pour les produits
exports.productValidator = [
    body('nom')
        .trim()
        .notEmpty()
        .withMessage('Le nom du produit est requis'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('La description est requise'),
    body('prix')
        .isNumeric()
        .withMessage('Le prix doit être un nombre'),
    body('stock')
        .isNumeric()
        .withMessage('Le stock doit être un nombre'),
    body('categorie_id')
        .isNumeric()
        .withMessage('L\'ID de la catégorie doit être un nombre')
];

// Validation pour les commandes
exports.orderValidator = [
    body('clientId')
        .isNumeric()
        .withMessage('L\'ID du client doit être un nombre'),
    body('items')
        .isArray()
        .withMessage('Les items doivent être un tableau'),
    body('totalAmount')
        .isNumeric()
        .withMessage('Le montant total doit être un nombre'),
    body('paymentMethod')
        .isIn(['cash', 'card', 'mobile'])
        .withMessage('La méthode de paiement n\'est pas valide')
];

// Middleware de validation
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
