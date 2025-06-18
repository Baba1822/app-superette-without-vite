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
      const orders = response.data.map(order => ({
        ...order,
        total: parseFloat(order.total),
        items: order.items.map(item => ({
          ...item,
          price: parseFloat(item.price),
          total: parseFloat(item.total)
        }))
      }));
      return orders;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${id}`);
      const order = response.data;
      order.total = parseFloat(order.total);
      order.items = order.items.map(item => ({
        ...item,
        price: parseFloat(item.price),
        total: parseFloat(item.total)
      }));
      return order;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      throw error;
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
      const response = await axiosInstance.get('/api/orders'); // Assuming this endpoint returns all orders for admin
      const orders = response.data.map(order => ({
        ...order,
        total: parseFloat(order.total),
        items: order.items.map(item => ({
          ...item,
          price: parseFloat(item.price),
          total: parseFloat(item.total)
        }))
      }));
      return orders;
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les commandes:', error);
      throw error;
    }
  },
};