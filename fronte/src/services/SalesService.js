import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Récupérer toutes les ventes
export const getAllSales = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des ventes:', error);
        throw error;
    }
};

// Récupérer une vente par son ID
export const getSaleById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de la vente:', error);
        throw error;
    }
};

// Créer une nouvelle vente
export const createSale = async (saleData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/sales`, saleData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la vente:', error);
        throw error;
    }
};

// Mettre à jour une vente
export const updateSale = async (id, saleData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/sales/${id}`, saleData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la vente:', error);
        throw error;
    }
};

// Supprimer une vente
export const deleteSale = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/sales/${id}`);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la vente:', error);
        throw error;
    }
};

// Récupérer les statistiques des ventes
export const getSalesStats = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/statistics`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        throw error;
    }
};

// Récupérer les meilleures ventes
export const getTopSales = async (limit = 5) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/top-products`, {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des meilleures ventes:', error);
        throw error;
    }
};

// Générer un rapport de ventes
export const generateSalesReport = async (startDate, endDate, format = 'pdf') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/report`, {
            params: { startDate, endDate, format },
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la génération du rapport:', error);
        throw error;
    }
};

// Récupérer l'historique des ventes d'un client
export const getCustomerSalesHistory = async (customerId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/customer/${customerId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique des ventes:', error);
        throw error;
    }
};

// Récupérer les ventes par période
export const getSalesByPeriod = async (period) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/by-category`, {
            params: { period }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des ventes par période:', error);
        throw error;
    }
};

// Générer une facture
export const generateInvoice = async (saleId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/${saleId}/invoice`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la génération de la facture:', error);
        throw error;
    }
};

// Analyser les tendances des ventes
export const analyzeSalesTrends = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/trends`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'analyse des tendances:', error);
        throw error;
    }
};

// Calculer les prévisions de ventes
export const calculateSalesForecasts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/forecasts`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du calcul des prévisions:', error);
        throw error;
    }
};

// Envoyer une facture par email
export const sendInvoiceByEmail = async (saleId, email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/sales/${saleId}/send-invoice`, {
            email,
            template: 'invoice_email',
            subject: 'Votre facture'
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la facture par email:', error);
        throw error;
    }
};

// Marquer une facture comme payée
export const markInvoiceAsPaid = async (saleId, paymentDetails) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/sales/${saleId}/mark-paid`, paymentDetails);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du marquage de la facture comme payée:', error);
        throw error;
    }
};

// Récupérer l'historique des factures
export const getInvoiceHistory = async (filters = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/invoices`, { params: filters });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique des factures:', error);
        throw error;
    }
};

// Récupérer les factures impayées
export const getUnpaidInvoices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/unpaid-invoices`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des factures impayées:', error);
        throw error;
    }
};

// Envoyer un rappel de facture
export const sendInvoiceReminder = async (saleId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/sales/${saleId}/reminder`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du rappel de facture:', error);
        throw error;
    }
};

// Générer un duplicata de facture
export const generateInvoiceDuplicate = async (saleId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/${saleId}/duplicate`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la génération du duplicata:', error);
        throw error;
    }
};

// Annuler une facture
export const cancelInvoice = async (saleId, reason) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/sales/${saleId}/cancel`, { reason });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'annulation de la facture:', error);
        throw error;
    }
};

// Récupérer les statistiques des factures
export const getInvoiceStats = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/sales/invoice-stats`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des factures:', error);
        throw error;
    }
};

// Export par défaut pour compatibilité
const SalesService = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    getSalesStats,
    getTopSales,
    generateSalesReport,
    getCustomerSalesHistory,
    getSalesByPeriod,
    generateInvoice,
    analyzeSalesTrends,
    calculateSalesForecasts,
    sendInvoiceByEmail,
    markInvoiceAsPaid,
    getInvoiceHistory,
    getUnpaidInvoices,
    sendInvoiceReminder,
    generateInvoiceDuplicate,
    cancelInvoice,
    getInvoiceStats
};

export default SalesService; 