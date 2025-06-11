import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE_URL}/api/products`;

// Configuration d'Axios pour inclure le token JWT
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  // Récupérer tous les produits
  getAllProducts: async () => {
    try {
      const response = await axiosInstance.get('/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  // Récupérer un produit par ID
  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau produit
  createProduct: async (productData) => {
    try {
      // Convertir les dates en format ISO
      const formattedData = {
        ...productData,
        date_debut_saison: productData.date_debut_saison?.toISOString(),
        date_fin_saison: productData.date_fin_saison?.toISOString(),
        date_debut_promo: productData.date_debut_promo?.toISOString(),
        date_fin_promo: productData.date_fin_promo?.toISOString(),
        date_peremption: productData.date_peremption?.toISOString(),
      };

      const response = await axiosInstance.post('/', formattedData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  // Mettre à jour un produit
  updateProduct: async (id, productData) => {
    try {
      // Convertir les dates en format ISO
      const formattedData = {
        ...productData,
        date_debut_saison: productData.date_debut_saison?.toISOString(),
        date_fin_saison: productData.date_fin_saison?.toISOString(),
        date_debut_promo: productData.date_debut_promo?.toISOString(),
        date_fin_promo: productData.date_fin_promo?.toISOString(),
        date_peremption: productData.date_peremption?.toISOString(),
      };

      const response = await axiosInstance.put(`/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un produit
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  },

  // Uploader une image
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
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'upload de l'image pour le produit ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les produits en promotion
  getPromotionalProducts: async () => {
    try {
      const response = await axiosInstance.get('/promotions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits en promotion:', error);
      throw error;
    }
  },

  // Récupérer les produits saisonniers
  getSeasonalProducts: async () => {
    try {
      const response = await axiosInstance.get('/seasonal');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits saisonniers:', error);
      throw error;
    }
  },

  // Récupérer les produits avec stock faible
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