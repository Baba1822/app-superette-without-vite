// src/services/LoyaltyService.js
import axios from 'axios';

class LoyaltyService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
        this.pointsPerGNF = 0.01; // 1 point pour chaque 100 GNF dépensés
        this.pointValueInGNF = 10; // 1 point = 10 GNF de réduction
    }

    // Récupérer les informations de la carte de fidélité
    async getLoyaltyCard(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/loyalty/${clientId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la carte de fidélité:', error);
            throw error;
        }
    }

    // Créer une nouvelle carte de fidélité
    async createLoyaltyCard(cardData) {
        try {
            const response = await axios.post(`${this.apiUrl}/loyalty`, cardData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la carte:', error);
            throw error;
        }
    }

    // Mettre à jour une carte de fidélité
    async updateLoyaltyCard(cardId, cardData) {
        try {
            const response = await axios.put(`${this.apiUrl}/loyalty/${cardId}`, cardData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la carte:', error);
            throw error;
        }
    }

    // Supprimer une carte de fidélité
    async deleteLoyaltyCard(cardId) {
        try {
            const response = await axios.delete(`${this.apiUrl}/loyalty/${cardId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression de la carte:', error);
            throw error;
        }
    }

    // Calculer les points pour un montant d'achat
    calculatePoints(amount) {
        return Math.floor(amount * this.pointsPerGNF);
    }

    // Ajouter des points à la carte de fidélité
    async addPoints(clientId, amount, transactionId) {
        const points = this.calculatePoints(amount);
        try {
            const response = await axios.post(`${this.apiUrl}/loyalty/${clientId}/points/add`, {
                points,
                amount,
                transactionId,
                timestamp: new Date().toISOString()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout des points:', error);
            throw error;
        }
    }

    // Utiliser des points pour une récompense
    async redeemPoints(clientId, rewardId, pointsToRedeem) {
        try {
            const response = await axios.post(`${this.apiUrl}/loyalty/${clientId}/points/redeem`, {
                rewardId,
                pointsToRedeem,
                timestamp: new Date().toISOString()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'utilisation des points:', error);
            throw error;
        }
    }

    // Obtenir l'historique des points
    async getPointsHistory(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/loyalty/${clientId}/history`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error);
            throw error;
        }
    }

    // Obtenir les récompenses disponibles
    async getAvailableRewards(clientId = null) {
        try {
            const url = clientId 
                ? `${this.apiUrl}/loyalty/${clientId}/rewards`
                : `${this.apiUrl}/loyalty/rewards`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des récompenses:', error);
            throw error;
        }
    }

    // Vérifier le niveau de fidélité
    async checkLoyaltyTier(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/loyalty/${clientId}/tier`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la vérification du niveau:', error);
            throw error;
        }
    }

    // Obtenir les statistiques de fidélité
    async getLoyaltyStats() {
        try {
            const response = await axios.get(`${this.apiUrl}/loyalty/stats`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }

    // Convertir des points en valeur monétaire
    convertPointsToGNF(points) {
        return points * this.pointValueInGNF;
    }

    // Vérifier si une récompense est disponible pour le client
    async checkRewardAvailability(clientId, rewardId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/loyalty/${clientId}/rewards/${rewardId}/availability`
            );
            return response.data.available;
        } catch (error) {
            console.error('Erreur lors de la vérification de disponibilité:', error);
            throw error;
        }
    }
}

export default new LoyaltyService();