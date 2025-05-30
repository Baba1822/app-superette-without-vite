import axios from 'axios';

const BASE_URL = '/clients';

export const clientService = {
  // Récupérer tous les clients (admin)
  getAllClients: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // Récupérer un client par son ID
  getClientById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Récupérer le profil du client connecté
  getCurrentClient: async () => {
    const response = await axios.get(`${BASE_URL}/profile`);
    return response.data;
  },

  // Mettre à jour le profil du client
  updateProfile: async (profileData) => {
    const response = await axios.put(`${BASE_URL}/profile`, profileData);
    return response.data;
  },

  // Mettre à jour le statut d'un client (admin)
  updateClientStatus: async (id, status) => {
    const response = await axios.patch(`${BASE_URL}/${id}/status`, { status });
    return response.data;
  },

  // Supprimer un client (admin)
  deleteClient: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Récupérer l'historique des commandes d'un client
  getClientOrders: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}/orders`);
    return response.data;
  },

  // Récupérer les statistiques d'un client (admin)
  getClientStats: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}/stats`);
    return response.data;
  }
}; 