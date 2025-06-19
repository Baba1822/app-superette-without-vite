import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE_URL}/api/loyalty`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loyaltyService = {
  getLoyaltyCard: async (customerId) => {
    try {
      const response = await axiosInstance.get(`/cards/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la carte de fidélité:', error);
      throw error;
    }
  },

  createLoyaltyCard: async (customerId) => {
    try {
      const response = await axiosInstance.post('/cards', { customerId });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la carte de fidélité:', error);
      throw error;
    }
  },

  redeemPoints: async (clientId, points) => {
    try {
      const response = await axiosInstance.post(`/cards/${clientId}/redeem`, { points });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réduction des points:', error);
      throw error;
    }
  },

  addPoints: async (clientId, points) => {
    try {
      const response = await axiosInstance.post(`/cards/${clientId}/points`, { points });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout des points:', error);
      throw error;
    }
  },

  checkLoyaltyTier: async (clientId) => {
    try {
      const response = await axiosInstance.get(`/cards/${clientId}/tier`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du niveau de fidélité:', error);
      throw error;
    }
  },

  getAvailableRewards: async () => {
    try {
      const response = await axiosInstance.get('/rewards');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des récompenses disponibles:', error);
      throw error;
    }
  },

  getPointsHistory: async (clientId) => {
    try {
      const response = await axiosInstance.get(`/cards/${clientId}/history`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des points:', error);
      throw error;
    }
  },

  getLoyaltyStats: async () => {
    try {
      const response = await axiosInstance.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de fidélité:', error);
      throw error;
    }
  },

  updateLoyaltyCard: async (cardId, cardData) => {
    try {
      const response = await axiosInstance.put(`/cards/${cardId}`, cardData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la carte de fidélité:', error);
      throw error;
    }
  },

  deleteLoyaltyCard: async (cardId) => {
    try {
      const response = await axiosInstance.delete(`/cards/${cardId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte de fidélité:', error);
      throw error;
    }
  },
};