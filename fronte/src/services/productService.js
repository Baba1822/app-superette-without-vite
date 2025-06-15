import axios from 'axios';
import { EventEmitter } from 'events';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const eventEmitter = new EventEmitter();

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'La requête a expiré';
    }
    return Promise.reject(error);
  }
);

const emitProductEvent = (action, product) => {
  eventEmitter.emit('product-update', { action, product });
};

export const productService = {
  subscribeToProducts: (callback) => {
    eventEmitter.on('product-update', callback);
    return () => eventEmitter.off('product-update', callback);
  },

  getAllProducts: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/api/products', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw {
        message: 'Impossible de charger les produits',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw {
        message: `Impossible de charger le produit ${id}`,
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/api/products', productData);
      emitProductEvent('created', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw {
        message: 'Échec de la création du produit',
        details: error.response?.data?.errors || error.message,
        status: error.response?.status
      };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`/api/products/${id}`, productData);
      emitProductEvent('updated', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw {
        message: `Échec de la mise à jour du produit ${id}`,
        details: error.response?.data?.errors || error.message,
        status: error.response?.status
      };
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/products/${id}`);
      emitProductEvent('deleted', { id });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      
      let errorMessage = 'Erreur lors de la suppression';
      let status = error.response?.status || 500;
      
      if (status === 404) {
        errorMessage = 'Produit non trouvé';
      } else if (error.response?.data?.message?.includes('contrainte')) {
        errorMessage = 'Impossible de supprimer - produit utilisé dans des commandes';
      } else if (error.code === 'ERR_INVALID_URL') {
        errorMessage = 'URL invalide pour l\'API';
        status = 400;
      }

      throw {
        message: errorMessage,
        status: status,
        details: error.response?.data?.message || error.message,
        productId: id
      };
    }
  },

  uploadImage: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post(
        `/api/products/${id}/image`,
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
      throw {
        message: 'Échec du téléchargement de l\'image',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  updateStock: async (id, quantityChange) => {
    try {
      const response = await axiosInstance.patch(
        `/api/products/${id}/stock`,
        { quantityChange }
      );
      emitProductEvent('updated', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du stock pour le produit ${id}:`, error);
      throw {
        message: 'Échec de la mise à jour du stock',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  getPromotionalProducts: async () => {
    try {
      const response = await axiosInstance.get('/api/products/promotions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des promotions:', error);
      throw {
        message: 'Impossible de charger les promotions',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  getSeasonalProducts: async () => {
    try {
      const response = await axiosInstance.get('/api/products/seasonal');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits saisonniers:', error);
      throw {
        message: 'Impossible de charger les produits saisonniers',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  getLowStockProducts: async (threshold = 5) => {
    try {
      const response = await axiosInstance.get('/api/products/low-stock', {
        params: { threshold }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits en stock faible:', error);
      throw {
        message: 'Impossible de charger les produits en stock faible',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }
};