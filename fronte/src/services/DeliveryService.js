import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Service principal de livraison
export const DeliveryService = {
  // Récupérer toutes les livraisons
  getAllDeliveries: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deliveries`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des livraisons:', error);
      throw error;
    }
  },

  // Récupérer une livraison spécifique
  getDelivery: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deliveries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la livraison ${id}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle livraison
  createDelivery: async (deliveryData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/deliveries`, deliveryData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la livraison:', error);
      throw error;
    }
  },

  // Mettre à jour une livraison
  updateDelivery: async (id, deliveryData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/deliveries/${id}`, deliveryData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la livraison ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une livraison
  deleteDelivery: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deliveries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la livraison ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les zones de livraison
  getDeliveryZones: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/delivery-zones`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des zones:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'une livraison
  updateDeliveryStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/deliveries/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut ${id}:`, error);
      throw error;
    }
  },

  // Assigner un livreur à une livraison
  assignDelivery: async (id, courierId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/deliveries/${id}/assign`, { courierId });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'assignation du livreur ${id}:`, error);
      throw error;
    }
  },

  // Générer un rapport des livraisons
  generateDeliveryReport: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/deliveries/report`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      throw error;
    }
  },

  // Calculer le coût de livraison
  calculateDeliveryCost: async (distance) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/deliveries/cost`, { distance });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du calcul du coût:', error);
      throw error;
    }
  },

  // ====================
  // Gestion des livreurs (couriers)
  // ====================
  getAllCouriers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/couriers`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des livreurs:', error);
      throw error;
    }
  },

  createCourier: async (courierData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/couriers`, courierData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du livreur:', error);
      throw error;
    }
  },

  updateCourier: async (id, courierData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/couriers/${id}`, courierData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du livreur ${id}:`, error);
      throw error;
    }
  },

  deleteCourier: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/couriers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du livreur ${id}:`, error);
      throw error;
    }
  },

  getCourierHistory: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/couriers/${id}/history`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique du livreur ${id}:`, error);
      throw error;
    }
  }
};

// Fonctions historiques
export const getCustomerDeliveryHistory = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deliveries/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'historique du client ${customerId}:`, error);
    throw error;
  }
};

export const getDriverDeliveryHistory = async (driverId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deliveries/driver/${driverId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'historique du livreur ${driverId}:`, error);
    throw error;
  }
};

export const getPendingDeliveries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deliveries/status/pending`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons en attente:', error);
    throw error;
  }
};

export const getInTransitDeliveries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deliveries/status/in_transit`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons en cours:', error);
    throw error;
  }
};

export const getTodayDeliveries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deliveries/today`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons du jour:', error);
    throw error;
  }
};

// Fonctions utilitaires
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Implémentation de la formule Haversine pour calculer la distance
  const R = 6371; // Rayon de la terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d;
};

export const formatDeliveryStatus = (status) => {
  const statusMap = {
    pending: 'En attente',
    processing: 'En préparation',
    in_transit: 'En cours de livraison',
    delivered: 'Livré',
    cancelled: 'Annulé'
  };
  return statusMap[status] || status;
};

export const formatDeliveryDate = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fonctions de validation
export const validateDeliveryAddress = (address) => {
  const requiredFields = ['street', 'city', 'country'];
  return requiredFields.every(field => address[field]);
};

export const validateDeliveryTime = (time) => {
  const now = new Date();
  const deliveryTime = new Date(time);
  return deliveryTime > now;
};

// Fonctions de calcul
export const calculateDeliveryFee = (distance) => {
  // Tarification basée sur la distance depuis Conakry
  if (distance <= 5) { // Moins de 5km
    return 5000; // 5000 GNF
  } else if (distance <= 10) { // 5-10km
    return 10000; // 10000 GNF
  } else if (distance <= 20) { // 10-20km
    return 15000; // 15000 GNF
  } else {
    // Plus de 20km : 15000 GNF + 500 GNF par km supplémentaire
    return 15000 + (distance - 20) * 500;
  }
};

// Fonctions de rapport
export const generateDeliverySummary = (deliveries) => {
  const summary = {
    totalDeliveries: deliveries.length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    inTransit: deliveries.filter(d => d.status === 'in_transit').length,
    cancelled: deliveries.filter(d => d.status === 'cancelled').length,
    totalRevenue: deliveries.reduce((sum, d) => sum + d.fee, 0)
  };
  return summary;
};

// Fonctions de gestion des erreurs
export const handleError = (error) => {
  console.error('Erreur:', error);
  if (error.response) {
    return error.response.data.message || 'Erreur serveur';
  }
  return 'Erreur réseau';
};

// Fonctions de cache
export const invalidateDeliveryCache = (queryClient) => {
  queryClient.invalidateQueries(['deliveries']);
  queryClient.invalidateQueries(['delivery-zones']);
  queryClient.invalidateQueries(['delivery-report']);
};

// Fonctions de formatage
export const formatDeliveryFee = (fee) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'GNF'
  }).format(fee);
};

// Fonctions de notification
export const showNotification = (message, type = 'info') => {
  toast[type](message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Fonctions de bordereau de livraison
export const generateDeliverySlip = async (deliveryId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/deliveries/${deliveryId}/slip`,
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la génération du bordereau ${deliveryId}:`, error);
    throw error;
  }
};

// Fonctions de disponibilité
export const checkDeliveryAvailability = async (zoneId, date) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/deliveries/zones/${zoneId}/availability`,
      { params: { date } }
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la vérification de la disponibilité ${zoneId}:`, error);
    throw error;
  }
};

// Fonctions de statistiques
export const getDeliveryStats = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/deliveries/stats`,
      { params: { startDate, endDate } }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};

// Fonctions de notification
export const sendDeliveryNotification = async (deliveryId, notificationType) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/deliveries/${deliveryId}/notify`,
      { type: notificationType }
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'envoi de la notification ${deliveryId}:`, error);
    throw error;
  }
};

 