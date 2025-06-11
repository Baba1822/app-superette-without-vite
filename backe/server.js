require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const { validate } = require('./utils/validators');
const pool = require('./config/database');

// Controllers
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory } = require('./controllers/productController');
const { createOrder, getAllOrders, updateOrderStatus, getOrderDetails } = require('./controllers/orderController');
const { register, login, getCurrentUser } = require('./controllers/authController');

// Initialiser l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
app.use('/api/clients', require('./routes/clients'));

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
app.use('/api/admin/sales', require('./routes/salesManagement'));

// Finance routes
app.use('/api/finance', require('./routes/finance'));

// Inventory routes
app.use('/api/inventory', require('./routes/inventory'));

// Invoices routes
app.use('/api/invoices', require('./routes/invoices'));

// Manager routes
app.use('/api/manager', require('./routes/manager'));

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

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
const server = app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Gestion des erreurs de serveur
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    
    const bind = typeof PORT === 'string' 
        ? 'Pipe ' + PORT 
        : 'Port ' + PORT;

    // Gérer les erreurs spécifiques
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' nécessite des privilèges d\'administrateur');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' est déjà en cours d\'utilisation');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

module.exports = app;