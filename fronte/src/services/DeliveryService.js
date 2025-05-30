import axios from 'axios';

class DeliveryService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL;
    }

    // Créer une nouvelle livraison
    async createDelivery(deliveryData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/deliveries`,
                deliveryData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la création de la livraison');
        }
    }

    // Obtenir toutes les livraisons
    async getAllDeliveries(filters = {}) {
        try {
            const response = await axios.get(`${this.apiUrl}/deliveries`, {
                params: filters
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des livraisons');
        }
    }

    // Obtenir une livraison par son ID
    async getDeliveryById(deliveryId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/deliveries/${deliveryId}`
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de la livraison');
        }
    }

    // Mettre à jour le statut d'une livraison
    async updateDeliveryStatus(deliveryId, status) {
        try {
            const response = await axios.patch(
                `${this.apiUrl}/deliveries/${deliveryId}/status`,
                { status }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour du statut');
        }
    }

    // Calculer les frais de livraison
    async calculateDeliveryFee(deliveryData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/deliveries/calculate-fee`,
                deliveryData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors du calcul des frais de livraison');
        }
    }

    // Assigner un livreur à une livraison
    async assignDeliveryDriver(deliveryId, driverId) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/deliveries/${deliveryId}/assign`,
                { driverId }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'assignation du livreur');
        }
    }

    // Obtenir l'historique des livraisons d'un client
    async getCustomerDeliveryHistory(customerId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/deliveries/customer/${customerId}/history`
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de l\'historique');
        }
    }

    // Envoyer une notification de livraison
    async sendDeliveryNotification(deliveryId, notificationType) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/deliveries/${deliveryId}/notify`,
                { type: notificationType }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'envoi de la notification');
        }
    }

    // Générer un bordereau de livraison
    async generateDeliverySlip(deliveryId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/deliveries/${deliveryId}/slip`,
                { responseType: 'blob' }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la génération du bordereau');
        }
    }

    // Obtenir les zones de livraison disponibles
    async getDeliveryZones() {
        try {
            const response = await axios.get(
                `${this.apiUrl}/deliveries/zones`
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des zones de livraison');
        }
    }

    // Vérifier la disponibilité de la livraison pour une zone
    async checkDeliveryAvailability(zoneId, date) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/deliveries/zones/${zoneId}/availability`,
                { params: { date } }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la vérification de la disponibilité');
        }
    }

    // Obtenir les statistiques de livraison
    async getDeliveryStats(startDate, endDate) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/deliveries/stats`,
                { params: { startDate, endDate } }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des statistiques');
        }
    }
}

const deliveryService = new DeliveryService();
export { deliveryService as DeliveryService }; 