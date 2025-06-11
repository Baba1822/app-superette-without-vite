import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
                headers: getHeaders()
            });
            
            // Transformer les données pour correspondre au format attendu par le composant
            const data = response.data;
            
            // Créer les cartes de statistiques
            const statCards = [
                {
                    title: 'Total Ventes',
                    value: data.total_ventes || 0,
                    trend: '',
                    icon: '📊'
                },
                {
                    title: 'Chiffre d\'affaires',
                    value: `${(data.chiffre_affaires || 0).toLocaleString()} GNF`,
                    trend: '',
                    icon: '💰'
                },
                {
                    title: 'Total Clients',
                    value: data.total_clients || 0,
                    trend: '',
                    icon: '👥'
                },
                {
                    title: 'Total Produits',
                    value: data.total_produits || 0,
                    trend: '',
                    icon: '📦'
                }
            ];
            
            return { ...data, statCards };
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    },

    // Données de ventes
    getSalesData: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/sales-data`, {
                headers: getHeaders()
            });
            
            // Transformer les données pour le graphique en secteurs
            const data = response.data;
            
            if (!data || data.length === 0) {
                return [];
            }
            
            // Grouper par mois ou semaine selon les données disponibles
            const salesByPeriod = data.reduce((acc, item) => {
                const period = new Date(item.date).toLocaleDateString('fr-FR', { 
                    month: 'short', 
                    day: 'numeric' 
                });
                
                if (!acc[period]) {
                    acc[period] = 0;
                }
                acc[period] += parseFloat(item.chiffre_affaires_jour || 0);
                return acc;
            }, {});
            
            return Object.entries(salesByPeriod).map(([name, value]) => ({
                name,
                value: Math.round(value)
            }));
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
            
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/sales-history?${params}`, {
                headers: getHeaders()
            });
            
            const data = response.data;
            
            if (!data || data.length === 0) {
                return [];
            }
            
            // Transformer les données pour le graphique linéaire
            return data.map(item => ({
                date: new Date(item.date).toLocaleDateString('fr-FR'),
                amount: parseFloat(item.chiffre_affaires_jour || 0),
                orders: parseInt(item.nombre_commandes || 0)
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des ventes:', error);
            throw error;
        }
    },

    // Top produits
    getTopProducts: async (limit = 5) => {
        try {
            // S'assurer que limit est un nombre
            const numericLimit = parseInt(limit) || 5;
            
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/top-products?limit=${numericLimit}`, {
                headers: getHeaders()
            });
            
            const data = response.data;
            
            if (!data || data.length === 0) {
                return [];
            }
            
            // Transformer les données pour le graphique en barres
            return data.map(product => ({
                name: product.nom || 'Produit inconnu',
                value: parseInt(product.total_vendu || 0),
                revenue: parseFloat(product.chiffre_affaires_produit || 0)
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des top produits:', error);
            throw error;
        }
    },

    // Alertes de stock
    getStockAlerts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stock-alerts`, {
                headers: getHeaders()
            });
            return response.data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des alertes de stock:', error);
            throw error;
        }
    },

    // Commandes récentes
    getRecentOrders: async (limit = 5) => {
        try {
            const numericLimit = parseInt(limit) || 5;
            
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/recent-orders?limit=${numericLimit}`, {
                headers: getHeaders()
            });
            return response.data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes récentes:', error);
            throw error;
        }
    },

    // Statistiques des clients
    getClientStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/client-stats`, {
                headers: getHeaders()
            });
            return response.data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques des clients:', error);
            throw error;
        }
    }
};

export default DashboardService;