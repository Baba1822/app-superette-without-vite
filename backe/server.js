require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const { validate } = require('./utils/validators');
const pool = require('./config/database');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { initializeWebSocket } = require('./services/websocketService');

// Configuration du port
const PORT = process.env.PORT || 5000;
console.log(`Configuration du serveur pour le port ${PORT}`);

// Controllers
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory, upload, Product } = require('./controllers/productController');
const { createOrder, getAllOrders, updateOrderStatus, getOrderDetails } = require('./controllers/orderController');
const { register, login, getCurrentUser } = require('./controllers/authController');

// Initialiser l'application Express
const app = express();
const server = http.createServer(app);

// Initialiser le serveur WebSocket et l'attacher au serveur HTTP
initializeWebSocket(server);

// Configuration CORS avec options détaillées
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware avec limite de taille augmentée
app.use(express.json({ 
    limit: '50mb',
    parameterLimit: 50000,
    extended: true
}));

app.use(express.urlencoded({ 
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

// Créer le dossier uploads/products s'il n'existe pas
const uploadsDir = path.join(__dirname, 'uploads', 'products');
fs.mkdir(uploadsDir, { recursive: true }, (err) => {
  if (err) console.error('Erreur lors de la création du dossier uploads:', err);
});

// Middleware pour servir les fichiers statiques
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads', 'products')));

// Route pour l'upload d'image
app.post('/api/products/:id/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier n\'a été envoyé' });
    }

    const productId = req.params.id;
    const product = await Product.getById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Vérifier et créer le dossier d'upload s'il n'existe pas
    const uploadDir = path.join(__dirname, 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Mettre à jour le chemin de l'image dans la base de données
    const imagePath = path.join('/uploads/products', req.file.filename);
    const result = await Product.uploadImage(productId, req.file);

    res.json(result);
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    res.status(500).json({ error: 'Erreur lors du téléchargement de l\'image' });
  }
});

// Routes existantes...

// Middleware pour les headers de sécurité
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Products routes
app.use('/api/products', require('./routes/products'));

// Orders routes
app.use('/api/orders', require('./routes/orders'));

// Suppliers routes
app.use('/api/suppliers', require('./routes/suppliers'));

// Stock routes
app.use('/api/stock', require('./routes/stock'));

// Clients routes
app.use('/api/customers', require('./routes/customers'));
// Categories routes
app.use('/api/categories', require('./routes/categories'));

// Deliveries routes
app.use('/api/deliveries', require('./routes/deliveries'));

// Employees routes
app.use('/api/employees', require('./routes/employees'));

// Promotions routes
app.use('/api/promotions', require('./routes/promotions'));

// Payments routes
app.use('/api/payments', require('./routes/payments'));

// Reports routes
app.use('/api/reports', require('./routes/reports'));

// Loyalty routes
app.use('/api/loyalty', require('./routes/loyalty'));

// Expenses routes
app.use('/api/expenses', require('./routes/expenses'));

// Stock report routes
app.use('/api/stock/report', require('./routes/stockReport'));

// Offers routes
app.use('/api/offers', require('./routes/offers'));

// Client management routes
app.use('/api/client', require('./routes/clientManagement'));

// Admin dashboard routes
app.use('/api/admin/dashboard', require('./routes/adminDashboard'));

// Delivery management routes
app.use('/api/admin/delivery', require('./routes/deliveryManagement'));

// Sales management routes
app.use('/api/sales', require('./routes/salesManagement'));

// Finance routes
app.use('/api/finance', require('./routes/finance'));

// Inventory routes
app.use('/api/inventory', require('./routes/inventory'));

// Invoices routes
app.use('/api/invoices', require('./routes/invoices'));

// Manager routes
app.use('/api/manager', require('./routes/manager'));
// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de test pour vérifier le serveur
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Serveur fonctionnel',
        timestamp: new Date().toISOString(),
        limits: {
            json: '50mb',
            urlencoded: '50mb'
        }
    });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} non trouvée`
    });
});

// Error handling middleware (doit être en dernier)
app.use(errorHandler);

// Fonction pour vérifier si le port est disponible
const isPortAvailable = (port) => new Promise((resolve, reject) => {
    const server = require('net').createServer().listen(port);
    server.on('listening', () => {
        server.close();
        resolve(true);
    });
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Le port ${port} est déjà en cours d'utilisation`);
            console.log('Essayez de trouver un autre processus qui utilise ce port et arrêtez-le, ou utilisez un port différent.');
            process.exit(1);
        }
        reject(error);
    });
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    console.log(`URL du serveur: http://localhost:${PORT}`);
    console.log(`Limite de taille des requêtes: 50MB`);
    console.log(`Route de test: http://localhost:${PORT}/api/health`);
});

// Gestion propre de l'arrêt du serveur
process.on('SIGTERM', () => {
    console.log('Signal SIGTERM reçu, arrêt du serveur...');
    server.close(() => {
        console.log('Serveur arrêté proprement');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Signal SIGINT reçu, arrêt du serveur...');
    server.close(() => {
        console.log('Serveur arrêté proprement');
        process.exit(0);
    });
});

module.exports = { app, server };