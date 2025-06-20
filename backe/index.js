require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/couriers', require('./routes/couriers'));

// Serveur statique pour le frontend en production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../fronte/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../fronte/build', 'index.html'));
    });
}

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// Initialisation WebSocket
const { initializeWebSocket } = require('./services/websocketService');
initializeWebSocket(server);
