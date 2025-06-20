import { EventEmitter } from 'events';
import axiosInstance, { API_BASE_URL } from './apiClient';

// Vérifier si l'URL de base est valide
if (!API_BASE_URL || typeof API_BASE_URL !== 'string') {
  console.error('L\'URL de base de l\'API (REACT_APP_API_URL) n\'est pas configurée ou est invalide.');
}

// Cet émetteur d'événements est maintenant déprécié et sera supprimé.
// Le backend gère la diffusion des mises à jour via WebSockets.
const eventEmitter = new EventEmitter();

export const productService = {
  // This subscription method is deprecated.
  // Components should use the ProductContext to get real-time updates.
  subscribeToProducts: (callback) => {
    eventEmitter.on('product-update', callback);
    return () => eventEmitter.off('product-update', callback);
  },

  getAllProducts: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/products', { params: filters });
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
      const response = await axiosInstance.get(`/products/${id}`);
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
      const response = await axiosInstance.post('/products', productData);
      // No longer need to emit a client-side event.
      // The backend will broadcast the 'created' event via WebSocket.
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
      const response = await axiosInstance.put(`/products/${id}`, productData);
      // No longer need to emit a client-side event.
      // The backend will broadcast the 'updated' event via WebSocket.
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
      if (isNaN(id)) {
        throw new Error('ID de produit invalide');
      }
      const response = await axiosInstance.delete(`/products/${id}`);
      // No longer need to emit a client-side event.
      // The backend will broadcast the 'deleted' event via WebSocket.
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      
      let errorMessage = 'Erreur lors de la suppression';
      let status = error.response?.status || 500;
      
      if (error.response?.status === 404) {
        errorMessage = 'Produit non trouvé';
      } else if (error.response?.data?.error?.includes('commandes')) {
        errorMessage = 'Impossible de supprimer - produit utilisé dans des commandes';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur serveur - veuillez réessayer plus tard';
      }

      throw {
        message: errorMessage,
        details: error.response?.data,
        status: status
      };
    }
  },

  uploadProductImage: async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axiosInstance.post(`/products/${id}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error('L\'image n\'a pas été correctement sauvegardée');
      }

      return {
        success: true,
        image_url: response.data.image_url
      };
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      throw {
        message: 'Échec du téléchargement de l\'image',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  updateStock: async (id, quantityChange) => {
    try {
      const response = await axiosInstance.put(`/products/${id}/stock`, 
        { quantityChange }
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du stock du produit ${id}:`, error);
      throw {
        message: `Échec de la mise à jour du stock du produit ${id}`,
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  getPromotionalProducts: async () => {
    try {
      const response = await axiosInstance.get('/products', { 
        params: { promotionsOnly: true } 
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits promotionnels:', error);
      throw {
        message: 'Impossible de charger les produits promotionnels',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  getSeasonalProducts: async () => {
    try {
      const response = await axiosInstance.get('/products', { 
        params: { seasonalOnly: true } 
      });
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
  },

  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw {
        message: 'Impossible de charger les catégories',
        details: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }
};