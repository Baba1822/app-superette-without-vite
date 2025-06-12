import axios from 'axios';

class CustomerService {
  constructor() {
    // Configuration de l'URL de base
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.apiUrl = `${this.baseUrl}/api/customers`;
    
    console.log('CustomerService initialisé avec URL:', this.apiUrl);
    
    // Création de l'instance axios avec configuration optimisée
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000, // 10 secondes de timeout
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Intercepteur pour ajouter le token à chaque requête
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`Requête ${config.method?.toUpperCase()} vers:`, config.url);
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Erreur dans l\'intercepteur de requête:', error);
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les erreurs de réponse
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`Réponse reçue de ${response.config.url}:`, response.status);
        return response;
      },
      (error) => {
        console.error('Erreur dans l\'intercepteur de réponse:', error);
        if (error.response?.status === 401) {
          console.warn('Token expiré ou invalide, redirection vers login');
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      }
    );
  }

  async getAllCustomers() {
    try {
      console.log('Tentative de récupération de tous les clients...');
      const response = await this.axiosInstance.get('/api/customers');
      return response.data;
    } catch (error) {
      this.handleError(error, 'récupération des clients');
      throw error;
    }
  }

  async getCustomerById(id) {
    try {
      const response = await this.axiosInstance.get(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'récupération du client');
      throw error;
    }
  }

  async createCustomer(customerData) {
    try {
      const response = await this.axiosInstance.post('/api/customers', customerData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'création du client');
      throw error;
    }
  }

  async updateCustomer(id, customerData) {
    try {
      const response = await this.axiosInstance.put(`/api/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'mise à jour du client');
      throw error;
    }
  }

  async deleteCustomer(id) {
    try {
      const response = await this.axiosInstance.delete(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'suppression du client');
      throw error;
    }
  }

  async updateCustomerStatus(id, status) {
    try {
      const response = await this.axiosInstance.patch(
        `/api/customers/${id}/status`, 
        { status }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'mise à jour du statut');
      throw error;
    }
  }

  async getCustomerStats(id) {
    try {
      const response = await this.axiosInstance.get(`/api/customers/${id}/stats`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'récupération des statistiques');
      throw error;
    }
  }

  async updateLoyaltyPoints(id, points, operation = 'add') {
    try {
      const response = await this.axiosInstance.post(
        `/api/customers/${id}/points`,
        { points, operation }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'mise à jour des points de fidélité');
      throw error;
    }
  }

  async getCustomerPurchaseHistory(id) {
    try {
      const response = await this.axiosInstance.get(`/api/customers/${id}/history`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'récupération de l\'historique des achats');
      throw error;
    }
  }

  handleError(error, context) {
    console.error(`Erreur lors de la ${context}:`, error);
    
    if (error.response) {
      // Le serveur a répondu avec un status d'erreur
      console.error('Détails de l\'erreur serveur:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase()
      });
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Erreur de réseau - Aucune réponse du serveur');
      console.log('Vérifiez que:');
      console.log('1. Le serveur backend est démarré');
      console.log(`2. L'URL ${this.baseUrl} est accessible`);
      console.log('3. Aucun problème de réseau ou firewall');
    } else {
      // Erreur dans la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }
  }

  async testConnection() {
    try {
      const response = await this.axiosInstance.get('/api/health', {
        timeout: 5000
      });
      return true;
    } catch (error) {
      this.handleError(error, 'test de connexion');
      return false;
    }
  }
}

const customerServiceInstance = new CustomerService();
export default customerServiceInstance;