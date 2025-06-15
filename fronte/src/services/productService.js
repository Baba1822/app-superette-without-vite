import axios from 'axios';
import { EventEmitter } from 'events';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// Base URL sans le slash final pour éviter les doubles slashes
const API_BASE_URL_NO_SLASH = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
const BASE_URL = `${API_BASE_URL_NO_SLASH}/api/products`;

const eventEmitter = new EventEmitter();

// Création de l'instance axios avec une configuration personnalisée
const axiosInstance = axios.create({
  baseURL: API_BASE_URL_NO_SLASH,
  headers: {
    'Content-Type': 'application/json',
  },
  // Configuration pour éviter les doubles slashes
  transformRequest: [(data) => {
    // Supprimer les slashes doubles dans l'URL
    if (data && typeof data === 'object') {
      const url = data.url || '';
      data.url = url.replace(/\/+/g, '/');
    }
    return data;
  }],
  // Configuration pour les requêtes
  paramsSerializer: params => {
    return new URLSearchParams(params).toString();
  }
});

// Middleware pour gérer les URLs
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Utiliser l'URL complète pour éviter les problèmes de base URL
  if (config.url?.startsWith('/')) {
    config.url = `${BASE_URL}${config.url}`;
  }
  
  // Logging pour débogage
  console.log('Requête:', config.method.toUpperCase(), config.url);
  console.log('Params:', config.params);
  
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
      // Vérifier que l'ID est un nombre
      const productId = parseInt(id);
      if (isNaN(productId)) {
        throw new Error('ID invalide');
      }

      // Construire l'URL complète
      const url = `${BASE_URL}${id}`;
      console.log('URL de suppression:', url);

      // Utiliser l'URL complète
      const response = await axiosInstance.delete(url);
      emitProductEvent('deleted', { id });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         'Erreur lors de la suppression du produit';
      
      throw {
        message: errorMessage,
        status: error.response?.status || 500,
        data: error.response?.data,
        url: `${BASE_URL}${id}`
      };
    }
  },

  uploadImage: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post(
        `/upload-image/${id}`,
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