import axios from 'axios';

class FinancialService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL;
    }

    // Récupérer les données financières générales
    async getFinancialOverview(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/overview`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des données financières');
        }
    }

    // Récupérer les données de vente
    async getSalesData(startDate, endDate, groupBy = 'day') {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/sales`, {
                params: { startDate, endDate, groupBy }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des données de vente');
        }
    }

    // Récupérer les données de dépenses
    async getExpensesData(startDate, endDate, groupBy = 'category') {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/expenses`, {
                params: { startDate, endDate, groupBy }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des données de dépenses');
        }
    }

    // Récupérer le flux de trésorerie
    async getCashFlow(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/cash-flow`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du flux de trésorerie');
        }
    }

    // Récupérer les meilleures ventes
    async getTopProducts(startDate, endDate, limit = 10) {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/top-products`, {
                params: { startDate, endDate, limit }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des meilleures ventes');
        }
    }

    // Générer un rapport financier
    async generateReport(startDate, endDate, type = 'monthly', format = 'pdf') {
        try {
            const response = await axios.get(
                `${this.apiUrl}/finance/reports/generate`,
                {
                    params: { startDate, endDate, type, format },
                    responseType: 'blob'
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la génération du rapport');
        }
    }

    // Envoyer un rapport par email
    async emailReport(startDate, endDate, type = 'monthly', recipients) {
        try {
            const response = await axios.post(`${this.apiUrl}/finance/reports/email`, {
                startDate,
                endDate,
                type,
                recipients
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'envoi du rapport par email');
        }
    }

    // Récupérer les indicateurs de performance (KPIs)
    async getKPIs(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/kpis`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des KPIs');
        }
    }

    // Récupérer les prévisions financières
    async getForecasts(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/forecasts`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des prévisions');
        }
    }

    // Enregistrer une transaction
    async recordTransaction(transactionData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/finance/transactions`,
                transactionData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'enregistrement de la transaction');
        }
    }

    // Récupérer l'historique des transactions
    async getTransactionHistory(startDate, endDate, type = 'all') {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/transactions`, {
                params: { startDate, endDate, type }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de l\'historique des transactions');
        }
    }

    // Calculer les taxes
    async calculateTaxes(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/taxes`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors du calcul des taxes');
        }
    }

    // Récupérer les marges par catégorie de produits
    async getProductMargins(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/margins`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des marges');
        }
    }

    // Analyser la rentabilité
    async analyzeProfitability(startDate, endDate, groupBy = 'product') {
        try {
            const response = await axios.get(`${this.apiUrl}/finance/profitability`, {
                params: { startDate, endDate, groupBy }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'analyse de la rentabilité');
        }
    }
}

export default new FinancialService(); 