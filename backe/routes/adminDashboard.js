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

// Middleware d'authentification simplifié pour le debug
const auth = (req, res, next) => {
    console.log(`Middleware auth - ${req.method} ${req.path}`);
    
    // Pour le debug, on accepte toutes les requêtes
    // En production, vous devriez vérifier le JWT token
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        console.log('Pas de token d\'autorisation - continuons pour le debug');
        // return res.status(401).json({ error: 'Token d\'accès requis' });
    }
    
    next();
};

// Route de test pour vérifier que les routes fonctionnent
router.get('/test', (req, res) => {
    console.log('Route /test appelée');
    res.json({ 
        message: 'Routes admin dashboard fonctionnelles',
        timestamp: new Date().toISOString(),
        path: req.path,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl
    });
});

// Log de debug pour voir toutes les requêtes
router.use((req, res, next) => {
    console.log(`Route admin dashboard appelée: ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Query params:', req.query);
    next();
});

// Routes pour le dashboard admin
if (adminDashboardController) {
    // Route pour les statistiques générales
    router.get('/stats', auth, (req, res) => {
        console.log('Route /stats appelée');
        adminDashboardController.getDashboardStats(req, res);
    });

    // Route pour les top produits
    router.get('/top-products', auth, (req, res) => {
        console.log('Route /top-products appelée avec limit:', req.query.limit);
        adminDashboardController.getTopProducts(req, res);
    });

    // Route pour les commandes récentes
    router.get('/recent-orders', auth, (req, res) => {
        console.log('Route /recent-orders appelée');
        adminDashboardController.getRecentOrders(req, res);
    });

    // Route pour les alertes de stock
    router.get('/stock-alerts', auth, (req, res) => {
        console.log('Route /stock-alerts appelée');
        adminDashboardController.getStockAlerts(req, res);
    });

    // Route pour les données de ventes
    router.get('/sales-data', auth, (req, res) => {
        console.log('Route /sales-data appelée');
        adminDashboardController.getSalesData(req, res);
    });

    // Route pour l'historique des ventes
    router.get('/sales-history', auth, (req, res) => {
        console.log('Route /sales-history appelée avec dates:', req.query);
        adminDashboardController.getSalesHistory(req, res);
    });

    // Route pour les statistiques des clients
    router.get('/client-stats', auth, (req, res) => {
        console.log('Route /client-stats appelée');
        adminDashboardController.getClientStats(req, res);
    });

    console.log('Toutes les routes admin dashboard sont configurées');
} else {
    // Routes de fallback si le contrôleur n'est pas disponible
    const fallbackHandler = (routeName) => (req, res) => {
        console.error(`Contrôleur non disponible pour la route ${routeName}`);
        res.status(500).json({ 
            error: 'Contrôleur non disponible',
            route: routeName,
            timestamp: new Date().toISOString()
        });
    };

    router.get('/stats', fallbackHandler('stats'));
    router.get('/top-products', fallbackHandler('top-products'));
    router.get('/recent-orders', fallbackHandler('recent-orders'));
    router.get('/stock-alerts', fallbackHandler('stock-alerts'));
    router.get('/sales-data', fallbackHandler('sales-data'));
    router.get('/sales-history', fallbackHandler('sales-history'));
    router.get('/client-stats', fallbackHandler('client-stats'));
    
    console.log('Routes admin dashboard configurées avec fallback');
}

// Route catch-all pour les routes non trouvées
router.use('*', (req, res) => {
    console.log(`Route non trouvée: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route non trouvée',
        path: req.path,
        method: req.method,
        availableRoutes: [
            'GET /api/admin/dashboard/test',
            'GET /api/admin/dashboard/stats',
            'GET /api/admin/dashboard/top-products',
            'GET /api/admin/dashboard/recent-orders',
            'GET /api/admin/dashboard/stock-alerts',
            'GET /api/admin/dashboard/sales-data',
            'GET /api/admin/dashboard/sales-history',
            'GET /api/admin/dashboard/client-stats'
        ]
    });
});

module.exports = router;