import axios from 'axios';
import { EventEmitter } from 'events';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const eventEmitter = new EventEmitter();

// Vérifier si l'URL de base est valide
if (!API_BASE_URL) {
  console.error('REACT_APP_API_URL n\'est pas défini');
  throw new Error('REACT_APP_API_URL n\'est pas défini');
}

if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  console.error('URL de l\'API invalide:', API_BASE_URL);
  throw new Error('URL de l\'API invalide. Vérifiez la variable REACT_APP_API_URL');
}

// Ajouter une vérification supplémentaire de l'URL
try {
  const url = new URL(API_BASE_URL);
  console.log('URL de l\'API validée:', url);
  if (!url.hostname) {
    throw new Error('URL invalide: aucun hostname');
  }
  if (!url.port) {
    throw new Error('URL invalide: aucun port spécifié');
  }
} catch (e) {
  console.error('Erreur de validation de l\'URL:', e);
  throw new Error('URL de l\'API invalide: ' + e.message);
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // Augmenter le timeout à 30 secondes
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'La requête a expiré';
    } else if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      if (error.response.data && error.response.data.message) {
        error.message = error.response.data.message;
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      error.message = 'Impossible de se connecter au serveur';
    } else {
      // Erreur lors de la configuration de la requête
      error.message = 'Erreur de configuration de la requête';
    }
    
    // Ajouter plus de détails pour le debug
    console.error('Erreur API:', {
      status: error.response?.status,
      message: error.message,
      details: error.response?.data
    });
    
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
      // Vérifier que l'ID est un nombre valide
      if (isNaN(id)) {
        throw new Error('ID de produit invalide');
      }

      // Ajouter des logs avant l'appel API
      console.log('Suppression du produit:', id);
      console.log('URL de la requête:', `${API_BASE_URL}/api/products/${id}`);

      const response = await axiosInstance.delete(`/api/products/${id}`);
      emitProductEvent('deleted', { id });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      
      let errorMessage = 'Erreur lors de la suppression';
      let status = error.response?.status || 500;
      
      // Analyser les différents types d'erreurs possibles
      if (error.code === 'ERR_INVALID_URL') {
        errorMessage = 'URL de l\'API invalide. Vérifiez la configuration.';
        status = 400;
      } else if (status === 404) {
        errorMessage = 'Produit non trouvé';
      } else if (error.response?.data?.message?.includes('contrainte')) {
        errorMessage = 'Impossible de supprimer - produit utilisé dans des commandes';
      } else if (error.response?.data?.message?.includes('stock')) {
        errorMessage = 'Impossible de supprimer - produit en stock';
      } else if (error.response?.data?.message?.includes('fichier')) {
        errorMessage = 'Erreur lors de la suppression des fichiers associés';
      } else if (status === 500) {
        errorMessage = 'Erreur serveur - veuillez réessayer plus tard';
      } else {
        errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      }

      // Ajouter plus de détails dans les logs
      console.error('Détails de l\'erreur de suppression:', {
        status: status,
        message: error.message,
        response: error.response?.data,
        productId: id,
        requestURL: `${API_BASE_URL}/api/products/${id}`,
        timestamp: new Date().toISOString()
      });

      throw {
        message: errorMessage,
        details: error.response?.data,
        status: status,
        productId: id,
        requestURL: `${API_BASE_URL}/api/products/${id}`
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
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      );
      
      if (!response.data?.success) {
        throw new Error('L\'image n\'a pas été correctement sauvegardée');
      }

      emitProductEvent('updated', {
        id: id,
        image_url: response.data.imagePath
      });
      
      return {
        image_url: response.data.imagePath,
        imageUrl: response.data.imageUrl
      };
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
      const response = await axiosInstance.get('/api/products?promotion=true');
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