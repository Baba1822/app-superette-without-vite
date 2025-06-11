const AdminDashboard = require('../models/AdminDashboard');

// Ajoutez cette vérification au début du fichier
console.log('Chargement du contrôleur adminDashboardController');

try {
    // Test de connexion au modèle
    console.log('Modèle AdminDashboard importé:', typeof AdminDashboard);
    console.log('Méthodes disponibles:', Object.getOwnPropertyNames(AdminDashboard));
} catch (error) {
    console.error('Erreur lors de l\'import du modèle AdminDashboard:', error);
}

exports.getDashboardStats = async (req, res) => {
    try {
        console.log('getDashboardStats appelée');
        console.log('Req headers:', req.headers);
        
        // Vérifier que le modèle est disponible
        if (!AdminDashboard || typeof AdminDashboard.getDashboardStats !== 'function') {
            throw new Error('Modèle AdminDashboard ou méthode getDashboardStats non disponible');
        }
        
        const stats = await AdminDashboard.getDashboardStats();
        console.log('Statistiques récupérées:', stats);
        
        res.json(stats);
    } catch (error) {
        console.error('Erreur getDashboardStats:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des statistiques',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        console.log('getTopProducts appelée avec query:', req.query);
        
        // Valider et traiter le paramètre limit
        let limit = 5; // Valeur par défaut
        
        if (req.query.limit) {
            const parsedLimit = parseInt(req.query.limit, 10);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
                limit = Math.min(parsedLimit, 50); // Limiter à 50 maximum
            } else {
                return res.status(400).json({ 
                    error: 'Le paramètre limit doit être un nombre entier positif' 
                });
            }
        }
        
        console.log('Limite utilisée:', limit);
        
        // Vérifier que le modèle est disponible
        if (!AdminDashboard || typeof AdminDashboard.getTopProducts !== 'function') {
            throw new Error('Modèle AdminDashboard ou méthode getTopProducts non disponible');
        }
        
        const products = await AdminDashboard.getTopProducts(limit);
        console.log('Produits récupérés:', products?.length || 0);
        
        res.json(products || []);
    } catch (error) {
        console.error('Erreur getTopProducts:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des produits les plus vendus',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getRecentOrders = async (req, res) => {
    try {
        console.log('getRecentOrders appelée');
        
        let limit = 5;
        if (req.query.limit) {
            const parsedLimit = parseInt(req.query.limit, 10);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
                limit = Math.min(parsedLimit, 50);
            }
        }
        
        if (!AdminDashboard || typeof AdminDashboard.getRecentOrders !== 'function') {
            throw new Error('Modèle AdminDashboard ou méthode getRecentOrders non disponible');
        }
        
        const orders = await AdminDashboard.getRecentOrders(limit);
        console.log('Commandes récupérées:', orders?.length || 0);
        
        res.json(orders || []);
    } catch (error) {
        console.error('Erreur getRecentOrders:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des commandes récentes',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getStockAlerts = async (req, res) => {
    try {
        console.log('getStockAlerts appelée');
        
        if (!AdminDashboard || typeof AdminDashboard.getStockAlerts !== 'function') {
            throw new Error('Modèle AdminDashboard ou méthode getStockAlerts non disponible');
        }
        
        const alerts = await AdminDashboard.getStockAlerts();
        console.log('Alertes récupérées:', alerts?.length || 0);
        
        res.json(alerts || []);
    } catch (error) {
        console.error('Erreur getStockAlerts:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des alertes de stock',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getSalesData = async (req, res) => {
    try {
        console.log('getSalesData appelée');
        
        if (!AdminDashboard || typeof AdminDashboard.getSalesData !== 'function') {
            throw new Error('Modèle AdminDashboard ou méthode getSalesData non disponible');
        }
        
        const salesData = await AdminDashboard.getSalesData();
        console.log('Données de ventes récupérées:', salesData?.length || 0);
        
        res.json(salesData || []);
    } catch (error) {
        console.error('Erreur getSalesData:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des données de ventes',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getSalesHistory = async (req, res) => {
    try {
        console.log('getSalesHistory appelée avec query:', req.query);
        const { startDate, endDate } = req.query;
        
        // Validation des dates si fournies
        if (startDate && isNaN(Date.parse(startDate))) {
            return res.status(400).json({ 
                error: 'Format de date de début invalide' 
            });
        }
        
        if (endDate && isNaN(Date.parse(endDate))) {
            return res.status(400).json({ 
                error: 'Format de date de fin invalide' 
            });
        }
        
        if (!AdminDashboard || typeof AdminDashboard.getSalesHistory !== 'function') {
            throw new Error('Modèle AdminDashboard ou méthode getSalesHistory non disponible');
        }
        
        const salesHistory = await AdminDashboard.getSalesHistory(startDate, endDate);
        console.log('Historique des ventes récupéré:', salesHistory?.length || 0);
        
        res.json(salesHistory || []);
    } catch (error) {
        console.error('Erreur getSalesHistory:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération de l\'historique des ventes',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getClientStats = async (req, res) => {
    try {
        console.log('getClientStats appelée');
        
        if (!AdminDashboard || typeof AdminDashboard.getClientStats !== 'function') {
            throw new Error('Modèle AdminDashboard ou méthode getClientStats non disponible');
        }
        
        const clientStats = await AdminDashboard.getClientStats();
        console.log('Statistiques clients récupérées:', clientStats?.length || 0);
        
        res.json(clientStats || []);
    } catch (error) {
        console.error('Erreur getClientStats:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des statistiques des clients',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

console.log('Contrôleur adminDashboardController chargé avec succès');