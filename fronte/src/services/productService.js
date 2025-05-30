import axios from 'axios';

const BASE_URL = '/products';

export const productService = {
  // Récupérer tous les produits
  getAllProducts: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // Récupérer un produit par son ID
  getProductById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Ajouter un nouveau produit (admin)
  createProduct: async (productData) => {
    const response = await axios.post(BASE_URL, productData);
    return response.data;
  },

  // Mettre à jour un produit (admin)
  updateProduct: async (id, productData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, productData);
    return response.data;
  },

  // Supprimer un produit (admin)
  deleteProduct: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
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