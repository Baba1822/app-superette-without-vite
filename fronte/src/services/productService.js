import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE_URL}/products`;

export const productService = {
  // Récupérer tous les produits
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  // Récupérer un produit par ID
  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau produit
  createProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  // Mettre à jour un produit
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un produit
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les produits en promotion
  getPromotions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/promotions`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des promotions:', error);
      throw error;
    }
  },

  // Récupérer les produits saisonniers
  getSeasonalProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/seasonal`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits saisonniers:', error);
      throw error;
    }
  },

  // Invalider le cache des produits
  invalidateCache: () => {
    // Cette fonction sera appelée par le composant parent pour forcer le rafraîchissement
    // Elle peut être utilisée quand un produit est ajouté/modifié depuis l'admin
  },

  // Mettre à jour le stock d'un produit
  updateStock: async (id, quantity) => {
    const response = await axios.patch(`${BASE_URL}/${id}/stock`, { quantity });
    return response.data;
  },

  // Ajouter une image à un produit
  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await axios.post(`${BASE_URL}/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Ajouter un avis sur un produit
  addReview: async (id, reviewData) => {
    const response = await axios.post(`${BASE_URL}/${id}/reviews`, reviewData);
    return response.data;
  },

  // Récupérer les avis d'un produit
  getProductReviews: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}/reviews`);
    return response.data;
  }
}; 