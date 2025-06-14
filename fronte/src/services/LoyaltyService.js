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
      const response = await axiosInstance.get(`/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la carte de fidélité:', error);
      throw error;
    }
  },

  createLoyaltyCard: async (customerId) => {
    try {
      const response = await axiosInstance.post('/', { customerId });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la carte de fidélité:', error);
      throw error;
    }
  },

  redeemPoints: async (cardId, points) => {
    try {
      const response = await axiosInstance.post(`/${cardId}/redeem`, { points });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réduction des points:', error);
      throw error;
    }
  },

  addPoints: async (cardId, points) => {
    try {
      const response = await axiosInstance.post(`/${cardId}/add`, { points });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout des points:', error);
      throw error;
    }
  },
};