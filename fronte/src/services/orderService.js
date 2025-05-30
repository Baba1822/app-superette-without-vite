import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const orderService = {
  // Créer une nouvelle commande
  createOrder: async (orderData) => {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  },

  // Récupérer toutes les commandes (pour l'admin)
  getAllOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  },

  // Récupérer les commandes d'un client spécifique
  getCustomerOrders: async (customerId) => {
    const response = await axios.get(`${API_BASE_URL}/orders/customer/${customerId}`);
    return response.data;
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (orderId, status) => {
    const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Annuler une commande
  cancelOrder: async (orderId) => {
    const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  }
}; 