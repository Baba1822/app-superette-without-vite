const express = require('express');
const router = express.Router();

// Import des contrôleurs - avec gestion d'erreur
let adminDashboardController;
try {
    adminDashboardController = require('../controllers/adminDashboardController');
    console.log('Contrôleur adminDashboard chargé avec succès');
} catch (error) {
    console.error('Erreur lors du chargement du contrôleur adminDashboard:', error);
}

// Middleware d'authentification optionnel pour le debug
const auth = (req, res, next) => {
    console.log('Middleware auth - requête reçue:', req.path);
    // Temporairement désactivé pour le debug
    next();
    
    // Version avec authentification (à activer plus tard)
    /*
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Token d\'accès requis' });
        }
        // Vérification du token ici
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
    */
};

// Route de test pour vérifier que les routes fonctionnent
router.get('/test', (req, res) => {
    console.log('Route /test appelée');
    res.json({ 
        message: 'Routes admin dashboard fonctionnelles',
        timestamp: new Date().toISOString(),
        path: req.path 
    });
});

// Routes pour le dashboard admin
if (adminDashboardController) {
    router.get('/stats', auth, adminDashboardController.getDashboardStats);
    router.get('/top-products', auth, adminDashboardController.getTopProducts);
    router.get('/recent-orders', auth, adminDashboardController.getRecentOrders);
    router.get('/stock-alerts', auth, adminDashboardController.getStockAlerts);
    router.get('/sales-data', auth, adminDashboardController.getSalesData);
    router.get('/sales-history', auth, adminDashboardController.getSalesHistory);
    router.get('/client-stats', auth, adminDashboardController.getClientStats);
    console.log('Toutes les routes admin dashboard sont configurées');
} else {
    // Routes de fallback si le contrôleur n'est pas disponible
    router.get('/stats', (req, res) => res.status(500).json({ error: 'Contrôleur non disponible' }));
    router.get('/top-products', (req, res) => res.status(500).json({ error: 'Contrôleur non disponible' }));
    router.get('/recent-orders', (req, res) => res.status(500).json({ error: 'Contrôleur non disponible' }));
    router.get('/stock-alerts', (req, res) => res.status(500).json({ error: 'Contrôleur non disponible' }));
    router.get('/sales-data', (req, res) => res.status(500).json({ error: 'Contrôleur non disponible' }));
    router.get('/sales-history', (req, res) => res.status(500).json({ error: 'Contrôleur non disponible' }));
    router.get('/client-stats', (req, res) => res.status(500).json({ error: 'Contrôleur non disponible' }));
    console.log('Routes admin dashboard configurées avec fallback');
}

module.exports = router;