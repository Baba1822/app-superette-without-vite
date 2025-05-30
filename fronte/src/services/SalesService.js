import axios from 'axios';

class SalesService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL;
    }

    // Récupérer toutes les ventes
    async getAllSales() {
        try {
            const response = await axios.get(`${this.apiUrl}/sales`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des ventes:', error);
            throw error;
        }
    }

    // Récupérer une vente par son ID
    async getSaleById(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la vente:', error);
            throw error;
        }
    }

    // Créer une nouvelle vente
    async createSale(saleData) {
        try {
            const response = await axios.post(`${this.apiUrl}/sales`, saleData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la vente:', error);
            throw error;
        }
    }

    // Mettre à jour une vente
    async updateSale(id, saleData) {
        try {
            const response = await axios.put(`${this.apiUrl}/sales/${id}`, saleData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la vente:', error);
            throw error;
        }
    }

    // Supprimer une vente
    async deleteSale(id) {
        try {
            await axios.delete(`${this.apiUrl}/sales/${id}`);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la vente:', error);
            throw error;
        }
    }

    // Récupérer les statistiques des ventes
    async getSalesStats(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/stats`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }

    // Récupérer les meilleures ventes
    async getTopSales(limit = 5) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/top`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des meilleures ventes:', error);
            throw error;
        }
    }

    // Générer un rapport de ventes
    async generateSalesReport(startDate, endDate, format = 'pdf') {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/report`, {
                params: { startDate, endDate, format },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la génération du rapport:', error);
            throw error;
        }
    }

    // Récupérer l'historique des ventes d'un client
    async getCustomerSalesHistory(customerId) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/customer/${customerId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des ventes:', error);
            throw error;
        }
    }

    // Récupérer les ventes par période
    async getSalesByPeriod(period) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/period/${period}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des ventes par période:', error);
            throw error;
        }
    }

    // Générer une facture
    async generateInvoice(saleId) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/${saleId}/invoice`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la génération de la facture:', error);
            throw error;
        }
    }

    // Analyser les tendances des ventes
    async analyzeSalesTrends(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/trends`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'analyse des tendances:', error);
            throw error;
        }
    }

    // Calculer les prévisions de ventes
    async calculateSalesForecasts() {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/forecasts`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors du calcul des prévisions:', error);
            throw error;
        }
    }

    // Envoyer une facture par email
    async sendInvoiceByEmail(saleId, email) {
        try {
            const response = await axios.post(`${this.apiUrl}/sales/${saleId}/send-invoice`, {
                email,
                template: 'invoice_email',
                subject: 'Votre facture'
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la facture par email:', error);
            throw error;
        }
    }

    // Marquer une facture comme payée
    async markInvoiceAsPaid(saleId, paymentDetails) {
        try {
            const response = await axios.put(`${this.apiUrl}/sales/${saleId}/mark-paid`, paymentDetails);
            return response.data;
        } catch (error) {
            console.error('Erreur lors du marquage de la facture comme payée:', error);
            throw error;
        }
    }

    // Récupérer l'historique des factures
    async getInvoiceHistory(filters = {}) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/invoices`, { params: filters });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des factures:', error);
            throw error;
        }
    }

    // Récupérer les factures impayées
    async getUnpaidInvoices() {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/invoices/unpaid`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des factures impayées:', error);
            throw error;
        }
    }

    // Envoyer un rappel de facture
    async sendInvoiceReminder(saleId) {
        try {
            const response = await axios.post(`${this.apiUrl}/sales/${saleId}/send-reminder`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du rappel de facture:', error);
            throw error;
        }
    }

    // Générer un duplicata de facture
    async generateInvoiceDuplicate(saleId) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/${saleId}/duplicate-invoice`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la génération du duplicata:', error);
            throw error;
        }
    }

    // Annuler une facture
    async cancelInvoice(saleId, reason) {
        try {
            const response = await axios.post(`${this.apiUrl}/sales/${saleId}/cancel-invoice`, { reason });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la facture:', error);
            throw error;
        }
    }

    // Récupérer les statistiques des factures
    async getInvoiceStats(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/sales/invoices/stats`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques des factures:', error);
            throw error;
        }
    }
}

const salesService = new SalesService();
export { salesService as SalesService }; 