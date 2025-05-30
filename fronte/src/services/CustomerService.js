import axios from 'axios';

class CustomerService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL;
    }

    // Récupérer tous les clients
    async getAllCustomers() {
        try {
            const response = await axios.get(`${this.apiUrl}/customers`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des clients:', error);
            throw error;
        }
    }

    // Récupérer un client par son ID
    async getCustomerById(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du client:', error);
            throw error;
        }
    }

    // Créer un nouveau client
    async createCustomer(customerData) {
        try {
            const response = await axios.post(`${this.apiUrl}/customers`, customerData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du client:', error);
            throw error;
        }
    }

    // Mettre à jour un client
    async updateCustomer(id, customerData) {
        try {
            const response = await axios.put(`${this.apiUrl}/customers/${id}`, customerData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du client:', error);
            throw error;
        }
    }

    // Supprimer un client
    async deleteCustomer(id) {
        try {
            await axios.delete(`${this.apiUrl}/customers/${id}`);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du client:', error);
            throw error;
        }
    }

    // Gérer les points de fidélité
    async updateLoyaltyPoints(id, points, operation = 'add') {
        try {
            const response = await axios.post(`${this.apiUrl}/customers/${id}/loyalty-points`, {
                points,
                operation
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des points de fidélité:', error);
            throw error;
        }
    }

    // Récupérer l'historique des achats d'un client
    async getCustomerPurchaseHistory(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/customers/${id}/purchases`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des achats:', error);
            throw error;
        }
    }

    // Vérifier l'éligibilité aux récompenses
    async checkRewardsEligibility(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/customers/${id}/rewards-eligibility`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la vérification des récompenses:', error);
            throw error;
        }
    }

    // Envoyer une notification au client
    async sendCustomerNotification(id, notification) {
        try {
            const response = await axios.post(`${this.apiUrl}/customers/${id}/notifications`, notification);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
            throw error;
        }
    }

    // Rechercher des clients
    async searchCustomers(query) {
        try {
            const response = await axios.get(`${this.apiUrl}/customers/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la recherche des clients:', error);
            throw error;
        }
    }

    // Exporter les données des clients
    async exportCustomersData(format = 'csv') {
        try {
            const response = await axios.get(`${this.apiUrl}/customers/export`, {
                params: { format },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'exportation des données:', error);
            throw error;
        }
    }
}

const customerService = new CustomerService();
export { customerService as CustomerService }; 