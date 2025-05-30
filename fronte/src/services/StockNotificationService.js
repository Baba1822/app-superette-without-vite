import axios from 'axios';

class StockNotificationService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL;
        this.twilioPhoneNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER;
    }

    async sendEmailNotification(supplier, product) {
        try {
            const emailData = {
                to: supplier.email,
                subject: `Alerte de stock bas - ${product.name}`,
                html: `
                    <h2>Alerte de Stock Bas</h2>
                    <p>Cher fournisseur,</p>
                    <p>Nous vous informons que le stock du produit suivant est bas :</p>
                    <ul>
                        <li><strong>Produit :</strong> ${product.name}</li>
                        <li><strong>Stock actuel :</strong> ${product.quantity} ${product.unit}</li>
                        <li><strong>Stock minimum :</strong> ${product.minQuantity} ${product.unit}</li>
                    </ul>
                    <p>Merci de nous contacter pour un réapprovisionnement.</p>
                    <p>Cordialement,<br>L'équipe de gestion des stocks</p>
                `
            };

            await axios.post(`${this.apiUrl}/notifications/email`, emailData);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            throw new Error('Échec de l\'envoi de l\'email');
        }
    }

    async sendSMSNotification(supplier, product) {
        try {
            const smsData = {
                to: supplier.phone,
                from: this.twilioPhoneNumber,
                body: `Alerte Stock Bas: ${product.name} - Quantité: ${product.quantity}/${product.minQuantity} ${product.unit}. Merci de nous contacter pour un réapprovisionnement.`
            };

            await axios.post(`${this.apiUrl}/notifications/sms`, smsData);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du SMS:', error);
            throw new Error('Échec de l\'envoi du SMS');
        }
    }

    async notifyLowStock(supplier, product) {
        try {
            const notifications = [];

            if (supplier.email) {
                notifications.push(this.sendEmailNotification(supplier, product));
            }

            if (supplier.phone) {
                notifications.push(this.sendSMSNotification(supplier, product));
            }

            await Promise.all(notifications);
            return {
                success: true,
                message: 'Notifications envoyées avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de l\'envoi des notifications:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    async scheduleStockCheck() {
        try {
            // Planifier une vérification quotidienne des stocks
            await axios.post(`${this.apiUrl}/stock/schedule-check`);
            return {
                success: true,
                message: 'Vérification des stocks planifiée'
            };
        } catch (error) {
            console.error('Erreur lors de la planification:', error);
            return {
                success: false,
                message: 'Échec de la planification de la vérification des stocks'
            };
        }
    }
}

export default new StockNotificationService(); 