import axios from 'axios';

class SupplierService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL;
    }

    // Récupérer tous les fournisseurs
    async getAllSuppliers() {
        try {
            const response = await axios.get(`${this.apiUrl}/suppliers`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des fournisseurs');
        }
    }

    // Récupérer un fournisseur par ID
    async getSupplierById(supplierId) {
        try {
            const response = await axios.get(`${this.apiUrl}/suppliers/${supplierId}`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du fournisseur');
        }
    }

    // Créer un nouveau fournisseur
    async createSupplier(supplierData) {
        try {
            const response = await axios.post(`${this.apiUrl}/suppliers`, supplierData);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la création du fournisseur');
        }
    }

    // Mettre à jour un fournisseur
    async updateSupplier(supplierId, supplierData) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/suppliers/${supplierId}`,
                supplierData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour du fournisseur');
        }
    }

    // Supprimer un fournisseur
    async deleteSupplier(supplierId) {
        try {
            await axios.delete(`${this.apiUrl}/suppliers/${supplierId}`);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du fournisseur');
        }
    }

    // Créer une commande fournisseur
    async createOrder(supplierId, orderData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/suppliers/${supplierId}/orders`,
                orderData
            );
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            throw error;
        }
    }

    // Récupérer les commandes d'un fournisseur
    async getSupplierOrders(supplierId) {
        try {
            const response = await axios.get(`${this.apiUrl}/suppliers/${supplierId}/orders`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            throw error;
        }
    }

    // Mettre à jour le statut d'une commande
    async updateOrderStatus(supplierId, orderId, status) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/suppliers/${supplierId}/orders/${orderId}/status`,
                { status }
            );
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la commande:', error);
            throw error;
        }
    }

    // Récupérer l'historique des paiements d'un fournisseur
    async getPaymentHistory(supplierId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/suppliers/${supplierId}/payments`
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de l\'historique des paiements');
        }
    }

    // Enregistrer un nouveau paiement
    async recordPayment(supplierId, paymentData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/suppliers/${supplierId}/payments`,
                paymentData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'enregistrement du paiement');
        }
    }

    // Mettre à jour un paiement
    async updatePayment(supplierId, paymentId, paymentData) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/suppliers/${supplierId}/payments/${paymentId}`,
                paymentData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour du paiement');
        }
    }

    // Supprimer un paiement
    async deletePayment(supplierId, paymentId) {
        try {
            await axios.delete(
                `${this.apiUrl}/suppliers/${supplierId}/payments/${paymentId}`
            );
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du paiement');
        }
    }

    // Envoyer un rappel de paiement
    async sendPaymentReminder(supplierId, paymentId) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/suppliers/${supplierId}/payments/${paymentId}/reminder`
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'envoi du rappel de paiement');
        }
    }

    // Récupérer les statistiques de paiement d'un fournisseur
    async getPaymentStats(supplierId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/suppliers/${supplierId}/payment-stats`
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des statistiques de paiement');
        }
    }

    // Générer un rapport de paiements
    async generatePaymentReport(supplierId, filters = {}) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/suppliers/${supplierId}/payment-report`,
                filters
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la génération du rapport de paiements');
        }
    }

    // Rechercher des fournisseurs
    async searchSuppliers(query) {
        try {
            const response = await axios.get(`${this.apiUrl}/suppliers/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la recherche des fournisseurs:', error);
            throw error;
        }
    }
}

export default new SupplierService(); 