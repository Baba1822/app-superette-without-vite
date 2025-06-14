import axios from 'axios';
import { EventEmitter } from 'events';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE_URL}/api/products`;

const eventEmitter = new EventEmitter();

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

// Fonction pour émettre les événements
const emitProductEvent = (action, product) => {
  eventEmitter.emit('product-update', { action, product });
};

export const productService = {
  // Écouter les changements de produits
  subscribeToProducts: (callback) => {
    eventEmitter.on('product-update', callback);
    return () => eventEmitter.off('product-update', callback);
  },

  getAllProducts: async () => {
    try {
      const response = await axiosInstance.get('/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const formattedData = {
        ...productData,
        date_debut_saison: productData.date_debut_saison?.toISOString(),
        date_fin_saison: productData.date_fin_saison?.toISOString(),
        date_debut_promo: productData.date_debut_promo?.toISOString(),
        date_fin_promo: productData.date_fin_promo?.toISOString(),
        date_peremption: productData.date_peremption?.toISOString(),
      };

      const response = await axiosInstance.post('/', formattedData);
      emitProductEvent('created', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const formattedData = {
        ...productData,
        date_debut_saison: productData.date_debut_saison?.toISOString(),
        date_fin_saison: productData.date_fin_saison?.toISOString(),
        date_debut_promo: productData.date_debut_promo?.toISOString(),
        date_fin_promo: productData.date_fin_promo?.toISOString(),
        date_peremption: productData.date_peremption?.toISOString(),
      };

      const response = await axiosInstance.put(`/${id}`, formattedData);
      emitProductEvent('updated', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/${id}`);
      emitProductEvent('deleted', { id });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  },

  uploadImage: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post(
        `/${id}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      emitProductEvent('updated', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'upload de l'image pour le produit ${id}:`, error);
      throw error;
    }
  },

  updateStock: async (id, quantityChange) => {
    try {
      const response = await axiosInstance.patch(`/${id}/stock`, { quantityChange });
      emitProductEvent('updated', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du stock pour le produit ${id}:`, error);
      throw error;
    }
  },

  getPromotionalProducts: async () => {
    try {
      const response = await axiosInstance.get('/promotions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits en promotion:', error);
      throw error;
    }
  },

  getSeasonalProducts: async () => {
    try {
      const response = await axiosInstance.get('/seasonal');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits saisonniers:', error);
      throw error;
    }
  },

  getLowStockProducts: async () => {
    try {
      const response = await axiosInstance.get('/low-stock');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits avec stock faible:', error);
      throw error;
    }
  },
};