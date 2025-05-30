import axios from 'axios';

class SeasonalProductService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
        
        // Définition des saisons en Guinée
        this.seasons = {
            SAISON_SECHE: {
                name: 'Saison Sèche',
                months: [11, 12, 1, 2, 3, 4], // Novembre à Avril
                description: 'Période caractérisée par l\'harmattan et peu de précipitations'
            },
            SAISON_PLUIES: {
                name: 'Saison des Pluies',
                months: [5, 6, 7, 8, 9, 10], // Mai à Octobre
                description: 'Période de fortes précipitations et d\'humidité élevée'
            }
        };

        // Produits typiques par saison
        this.seasonalProducts = {
            SAISON_SECHE: [
                'Mangues',
                'Oranges',
                'Mandarines',
                'Karité',
                'Anacarde',
                'Néré',
                'Fonio'
            ],
            SAISON_PLUIES: [
                'Maïs',
                'Riz local',
                'Arachides',
                'Manioc',
                'Taro',
                'Patates douces',
                'Ignames'
            ]
        };
    }

    // Obtenir la saison actuelle
    getCurrentSeason() {
        const currentMonth = new Date().getMonth() + 1; // Les mois commencent à 0
        for (const [season, data] of Object.entries(this.seasons)) {
            if (data.months.includes(currentMonth)) {
                return {
                    code: season,
                    ...data
                };
            }
        }
    }

    // Obtenir les produits de la saison actuelle
    async getCurrentSeasonalProducts() {
        const currentSeason = this.getCurrentSeason();
        try {
            const response = await axios.get(`${this.apiUrl}/products/seasonal/${currentSeason.code}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des produits saisonniers:', error);
            // Retourner les produits par défaut en cas d'erreur
            return this.seasonalProducts[currentSeason.code];
        }
    }

    // Obtenir les promotions actuelles
    async getCurrentPromotions() {
        try {
            const response = await axios.get(`${this.apiUrl}/promotions/current`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des promotions:', error);
            return [];
        }
    }

    // Créer une nouvelle promotion saisonnière
    async createSeasonalPromotion(promotionData) {
        try {
            const response = await axios.post(`${this.apiUrl}/seasonal/promotions`, promotionData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la promotion:', error);
            throw error;
        }
    }

    // Vérifier la disponibilité d'un produit pour la saison
    async checkProductAvailability(productId) {
        try {
            const response = await axios.get(`${this.apiUrl}/products/${productId}/availability`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la vérification de la disponibilité:', error);
            throw error;
        }
    }

    // Planifier les stocks pour la prochaine saison
    async planNextSeasonStock(planningData) {
        try {
            const response = await axios.post(`${this.apiUrl}/seasonal/planning`, planningData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la planification des stocks:', error);
            throw error;
        }
    }

    // Obtenir les prévisions de vente pour la saison
    async getSeasonalForecast() {
        const currentSeason = this.getCurrentSeason();
        try {
            const response = await axios.get(`${this.apiUrl}/seasonal/forecast/${currentSeason.code}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des prévisions:', error);
            throw error;
        }
    }

    // Gérer les alertes de stock pour les produits saisonniers
    async getSeasonalStockAlerts() {
        try {
            const response = await axios.get(`${this.apiUrl}/seasonal/stock-alerts`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des alertes:', error);
            throw error;
        }
    }

    // Récupérer les données de vente saisonnières
    async getSeasonalSalesData() {
        try {
            const response = await axios.get(`${this.apiUrl}/seasonal/sales`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données de ventes:', error);
            // Données de test en cas d'erreur
            return [
                { month: 'Jan', sales: 120000, target: 100000 },
                { month: 'Fév', sales: 150000, target: 130000 },
                { month: 'Mar', sales: 180000, target: 160000 },
                { month: 'Avr', sales: 220000, target: 200000 },
                { month: 'Mai', sales: 250000, target: 230000 },
                { month: 'Juin', sales: 280000, target: 260000 }
            ];
        }
    }

    // Récupérer les meilleurs produits saisonniers
    async getTopSeasonalProducts() {
        try {
            const response = await axios.get(`${this.apiUrl}/seasonal/top-products`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des meilleurs produits:', error);
            // Données de test en cas d'erreur
            return [
                {
                    id: 1,
                    name: 'Mangue Kent',
                    quantity: 1500,
                    revenue: 750000,
                    margin: 25
                },
                {
                    id: 2,
                    name: 'Ananas Pain de Sucre',
                    quantity: 1200,
                    revenue: 600000,
                    margin: 30
                },
                {
                    id: 3,
                    name: 'Banane Plantain',
                    quantity: 2000,
                    revenue: 400000,
                    margin: 20
                },
                {
                    id: 4,
                    name: 'Orange Valencia',
                    quantity: 1800,
                    revenue: 360000,
                    margin: 22
                }
            ];
        }
    }

    // Récupérer les prévisions de ventes
    async getSeasonalForecast() {
        try {
            const response = await axios.get(`${this.apiUrl}/seasonal/forecast`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des prévisions:', error);
            // Données de test en cas d'erreur
            return [
                { month: 'Juil', predicted: 300000, actual: 290000 },
                { month: 'Aoû', predicted: 320000, actual: 315000 },
                { month: 'Sep', predicted: 340000, actual: null },
                { month: 'Oct', predicted: 360000, actual: null },
                { month: 'Nov', predicted: 380000, actual: null },
                { month: 'Déc', predicted: 400000, actual: null }
            ];
        }
    }

    // Créer un nouveau produit saisonnier
    async createSeasonalProduct(productData) {
        try {
            const response = await axios.post(`${this.apiUrl}/seasonal/products`, productData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du produit:', error);
            throw error;
        }
    }

    // Mettre à jour un produit saisonnier
    async updateSeasonalProduct(productId, productData) {
        try {
            const response = await axios.put(`${this.apiUrl}/seasonal/products/${productId}`, productData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit:', error);
            throw error;
        }
    }

    // Supprimer un produit saisonnier
    async deleteSeasonalProduct(productId) {
        try {
            const response = await axios.delete(`${this.apiUrl}/seasonal/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            throw error;
        }
    }

    // Récupérer la saison actuelle
    async getCurrentSeason() {
        try {
            const response = await axios.get(`${this.apiUrl}/seasonal/current`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la saison:', error);
            // Données de test en cas d'erreur
            return {
                name: 'Saison des Pluies',
                description: 'Période de fortes pluies avec une demande accrue pour les imperméables et parapluies',
                startMonth: 5, // Mai
                endMonth: 10, // Octobre
                currentMonth: new Date().getMonth() + 1
            };
        }
    }

    // Mettre à jour les statistiques de vente
    async updateSalesStats(salesData) {
        try {
            const response = await axios.post(`${this.apiUrl}/seasonal/stats/update`, salesData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des statistiques:', error);
            throw error;
        }
    }

    // Mettre à jour une promotion saisonnière
    async updateSeasonalPromotion(promotionId, promotionData) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/seasonal/promotions/${promotionId}`,
                promotionData
            );
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la promotion:', error);
            throw error;
        }
    }

    // Supprimer une promotion saisonnière
    async deleteSeasonalPromotion(promotionId) {
        try {
            await axios.delete(`${this.apiUrl}/seasonal/promotions/${promotionId}`);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la promotion:', error);
            throw error;
        }
    }

    // Récupérer les statistiques de performance des promotions
    async getPromotionPerformance(promotionId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/seasonal/promotions/${promotionId}/performance`
            );
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des performances:', error);
            // Données de test en cas d'erreur
            return {
                totalSales: 250000,
                numberOfTransactions: 125,
                averageBasketSize: 2000,
                conversionRate: 15,
                revenueIncrease: 25
            };
        }
    }

    // Vérifier la disponibilité saisonnière d'un produit
    async checkSeasonalAvailability(productId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/seasonal/products/${productId}/availability`
            );
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la vérification de la disponibilité:', error);
            throw error;
        }
    }

    // Mettre à jour le calendrier saisonnier
    async updateSeasonalCalendar(calendarData) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/seasonal/calendar`,
                calendarData
            );
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du calendrier:', error);
            throw error;
        }
    }
}

export default new SeasonalProductService(); 