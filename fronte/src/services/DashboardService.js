import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Debug pour vérifier l'URL
console.log('API_BASE_URL:', API_BASE_URL);

// Fonction pour obtenir le token d'authentification
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Configuration des headers par défaut
const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

const DashboardService = {
    // Statistiques générales
    getDashboardStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    },

    // Données de ventes
    getSalesData: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/sales-data`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données de ventes:', error);
            throw error;
        }
    },

    // Historique des ventes avec filtres de date
    getSalesHistory: async (startDate = null, endDate = null) => {
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/sales-history?${params}`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des ventes:', error);
            throw error;
        }
    },

    // Top produits
    getTopProducts: async (limit = 5) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/top-products?limit=${limit}`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des top produits:', error);
            throw error;
        }
    },

    // Alertes de stock
    getStockAlerts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stock-alerts`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des alertes de stock:', error);
            throw error;
        }
    },

    // Commandes récentes
    getRecentOrders: async (limit = 5) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/recent-orders?limit=${limit}`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes récentes:', error);
            throw error;
        }
    },

    // Statistiques des clients
    getClientStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/client-stats`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques des clients:', error);
            throw error;
        }
    }
};

export default DashboardService;