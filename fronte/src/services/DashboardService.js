import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fonction pour obtenir le token d'authentification
const getAuthToken = () => {
    return localStorage.getItem('token');
};

const DashboardService = {
    // Statistiques générales
    getDashboardStats: async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/sales`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données de ventes:', error);
            throw error;
        }
    },

    // Top produits
    getTopProducts: async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/top-products`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des top produits:', error);
            throw error;
        }
    },

    // Historique des ventes
    getSalesHistory: async (startDate, endDate) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/sales/history`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des ventes:', error);
            throw error;
        }
    },

    // Statistiques des clients
    getClientStats: async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard/clients`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques des clients:', error);
            throw error;
        }
    }
};

export default DashboardService;
