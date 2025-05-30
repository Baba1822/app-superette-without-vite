import axios from 'axios';

class PaymentService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL;
    }

    // Initialiser un nouveau paiement
    async initiatePayment(paymentData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/initiate`,
                paymentData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'initialisation du paiement');
        }
    }

    // Traiter un paiement par carte bancaire
    async processCardPayment(paymentData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/card/process`,
                {
                    ...paymentData,
                    paymentMethod: 'CARD'
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors du traitement du paiement par carte');
        }
    }

    // Traiter un paiement par mobile money
    async processMobileMoneyPayment(paymentData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/mobile-money/process`,
                {
                    ...paymentData,
                    paymentMethod: 'MOBILE_MONEY'
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors du traitement du paiement mobile');
        }
    }

    // Traiter un paiement par virement bancaire
    async processBankTransfer(paymentData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/bank-transfer/process`,
                {
                    ...paymentData,
                    paymentMethod: 'BANK_TRANSFER'
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors du traitement du virement bancaire');
        }
    }

    // Générer un code QR pour le paiement
    async generateQRCode(paymentData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/qr-code/generate`,
                paymentData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la génération du code QR');
        }
    }

    // Vérifier le statut d'un paiement
    async checkPaymentStatus(paymentId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/payments/${paymentId}/status`
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la vérification du statut du paiement');
        }
    }

    // Récupérer l'historique des paiements
    async getPaymentHistory(filters = {}) {
        try {
            const response = await axios.get(`${this.apiUrl}/payments/history`, {
                params: filters
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de l\'historique des paiements');
        }
    }

    // Effectuer un remboursement
    async processRefund(paymentId, refundData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/${paymentId}/refund`,
                refundData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors du traitement du remboursement');
        }
    }

    // Récupérer les détails d'un paiement
    async getPaymentDetails(paymentId) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/payments/${paymentId}`
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des détails du paiement');
        }
    }

    // Valider les informations de paiement
    async validatePaymentInfo(paymentData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/validate`,
                paymentData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la validation des informations de paiement');
        }
    }

    // Générer un reçu de paiement
    async generateReceipt(paymentId, format = 'pdf') {
        try {
            const response = await axios.get(
                `${this.apiUrl}/payments/${paymentId}/receipt`,
                {
                    params: { format },
                    responseType: 'blob'
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la génération du reçu');
        }
    }

    // Envoyer un reçu par email
    async sendReceiptByEmail(paymentId, email) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/${paymentId}/send-receipt`,
                { email }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'envoi du reçu par email');
        }
    }

    // Obtenir les statistiques de paiement
    async getPaymentStats(startDate, endDate) {
        try {
            const response = await axios.get(`${this.apiUrl}/payments/stats`, {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des statistiques de paiement');
        }
    }

    // Configurer les webhooks de paiement
    async configureWebhook(webhookUrl, events) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/payments/webhooks/configure`,
                { webhookUrl, events }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la configuration du webhook');
        }
    }
}

export default new PaymentService(); 