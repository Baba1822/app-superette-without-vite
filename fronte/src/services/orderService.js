import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
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

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const response = await axiosInstance.get('/api/orders');
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Réponse invalide du serveur pour getOrders:', response.data);
        return [];
      }
      const orders = response.data.map(order => ({
        ...order,
        total: parseFloat(order.total) || 0,
        items: Array.isArray(order.items) ? order.items.map(item => ({
          ...item,
          price: parseFloat(item.price) || 0,
          total: parseFloat(item.total) || 0
        })) : []
      }));
      return orders;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      if (error.response?.status === 401) {
        console.warn('Utilisateur non authentifié pour récupérer les commandes');
      }
      return [];
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${id}`);
      if (!response.data) {
        console.warn('Réponse invalide du serveur pour getOrderById:', response.data);
        return null;
      }
      const order = response.data;
      order.total = parseFloat(order.total) || 0;
      order.items = Array.isArray(order.items) ? order.items.map(item => ({
        ...item,
        price: parseFloat(item.price) || 0,
        total: parseFloat(item.total) || 0
      })) : [];
      return order;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      return null;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la commande ${id}:`, error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await axiosInstance.get('/api/orders');
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Réponse invalide du serveur pour getAllOrders:', response.data);
        return [];
      }
      const orders = response.data.map(order => ({
        ...order,
        total: parseFloat(order.total) || 0,
        items: Array.isArray(order.items) ? order.items.map(item => ({
          ...item,
          price: parseFloat(item.price) || 0,
          total: parseFloat(item.total) || 0
        })) : []
      }));
      return orders;
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les commandes:', error);
      if (error.response?.status === 401) {
        console.warn('Utilisateur non authentifié pour récupérer toutes les commandes');
      }
      return [];
    }
  },
};