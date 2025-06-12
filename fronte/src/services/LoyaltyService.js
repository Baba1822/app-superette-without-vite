// src/services/LoyaltyService.js
import axios from 'axios';

class LoyaltyService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        this.pointsPerGNF = 0.01;
        this.pointValueInGNF = 10;
    }

    async getLoyaltyCard(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/loyalty/cards/${clientId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la carte de fidélité:', error);
            throw error;
        }
    }

    async createLoyaltyCard(cardData) {
        try {
            const response = await axios.post(`${this.apiUrl}/loyalty/cards`, cardData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la carte:', error);
            throw error;
        }
    }

    async updateLoyaltyCard(cardId, cardData) {
        try {
            const response = await axios.put(`${this.apiUrl}/loyalty/cards/${cardId}`, cardData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la carte:', error);
            throw error;
        }
    }

    async deleteLoyaltyCard(cardId) {
        try {
            const response = await axios.delete(`${this.apiUrl}/loyalty/cards/${cardId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression de la carte:', error);
            throw error;
        }
    }

    calculatePoints(amount) {
        return Math.floor(amount * this.pointsPerGNF);
    }

    async addPoints(clientId, amount, transactionId) {
        const points = this.calculatePoints(amount);
        try {
            const response = await axios.post(`${this.apiUrl}/loyalty/cards/${clientId}/points`, {
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

    async redeemPoints(clientId, rewardId, pointsToRedeem) {
        try {
            const response = await axios.post(`${this.apiUrl}/loyalty/cards/${clientId}/redeem`, {
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

    async getPointsHistory(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/loyalty/cards/${clientId}/history`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error);
            throw error;
        }
    }

    async getAvailableRewards(clientId = null) {
        try {
            const url = clientId 
                ? `${this.apiUrl}/loyalty/rewards?clientId=${clientId}`
                : `${this.apiUrl}/loyalty/rewards`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des récompenses:', error);
            throw error;
        }
    }

    async checkLoyaltyTier(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/loyalty/cards/${clientId}/tier`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la vérification du niveau:', error);
            throw error;
        }
    }

    async getLoyaltyStats() {
        try {
            const response = await axios.get(`${this.apiUrl}/loyalty/stats`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }

    convertPointsToGNF(points) {
        return points * this.pointValueInGNF;
    }

    async checkRewardAvailability(clientId, rewardId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/loyalty/rewards/${rewardId}/availability?clientId=${clientId}`
            );
            return response.data.available;
        } catch (error) {
            console.error('Erreur lors de la vérification de disponibilité:', error);
            throw error;
        }
    }
}

export default new LoyaltyService();