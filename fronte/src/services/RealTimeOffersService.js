import axios from 'axios';

class RealTimeOffersService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    }

    // Récupérer les offres personnalisées pour un client
    async getPersonalizedOffers(clientId, location = 'in-store') {
        try {
            const response = await axios.get(`${this.apiUrl}/offers/personalized/${clientId}`, {
                params: { location }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des offres personnalisées:', error);
            // Données de test en cas d'erreur
            return [
                {
                    id: 1,
                    title: "Offre spéciale fruits de saison",
                    description: "20% de réduction sur les mangues",
                    discountValue: 20,
                    discountType: "percentage",
                    validUntil: new Date(Date.now() + 3600000).toISOString(),
                    conditions: "Pour tout achat supérieur à 50000 GNF",
                    priority: "high",
                    category: "Fruits",
                    basePrice: 25000
                },
                {
                    id: 2,
                    title: "Promotion du jour",
                    description: "5000 GNF de réduction sur les légumes frais",
                    discountValue: 5000,
                    discountType: "fixed",
                    validUntil: new Date(Date.now() + 7200000).toISOString(),
                    conditions: "Sans minimum d'achat",
                    priority: "medium",
                    category: "Légumes",
                    basePrice: 15000
                }
            ];
        }
    }

    // Enregistrer l'interaction du client avec une offre
    async trackOfferInteraction(clientId, offerId, action) {
        try {
            await axios.post(`${this.apiUrl}/offers/track`, {
                clientId,
                offerId,
                action,
                timestamp: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Erreur lors du suivi de l\'interaction:', error);
            return false;
        }
    }

    // Vérifier l'éligibilité du client pour une offre
    async checkOfferEligibility(clientId, offerId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/offers/${offerId}/eligibility/${clientId}`
            );
            return response.data.eligible;
        } catch (error) {
            console.error('Erreur lors de la vérification d\'éligibilité:', error);
            return true; // Par défaut, considérer le client comme éligible
        }
    }

    // Envoyer une notification d'offre au client
    async sendOfferNotification(clientId, offerId, channel = 'sms') {
        try {
            await axios.post(`${this.apiUrl}/offers/notify`, {
                clientId,
                offerId,
                channel,
                timestamp: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
            return false;
        }
    }

    // Récupérer l'historique des offres du client
    async getClientOfferHistory(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/offers/history/${clientId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error);
            return [];
        }
    }

    // Analyser le comportement d'achat du client
    async analyzeClientBehavior(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/clients/${clientId}/behavior`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'analyse du comportement:', error);
            return {
                preferredCategories: [],
                averageSpending: 0,
                visitFrequency: 0,
                lastVisit: null
            };
        }
    }

    // Générer des recommandations personnalisées
    async generateRecommendations(clientId) {
        try {
            const response = await axios.get(`${this.apiUrl}/clients/${clientId}/recommendations`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la génération des recommandations:', error);
            return [];
        }
    }
}

export default new RealTimeOffersService(); 