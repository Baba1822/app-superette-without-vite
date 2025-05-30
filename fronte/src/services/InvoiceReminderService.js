import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

const InvoiceReminderService = {
  // Récupérer tous les rappels de factures
  getAllReminders: async () => {
    try {
      const response = await api.get('/invoice-reminders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer un nouveau rappel de facture
  createReminder: async (reminderData) => {
    try {
      const response = await api.post('/invoice-reminders', reminderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un rappel de facture
  updateReminder: async (id, reminderData) => {
    try {
      const response = await api.put(`/invoice-reminders/${id}`, reminderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un rappel de facture
  deleteReminder: async (id) => {
    try {
      const response = await api.delete(`/invoice-reminders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Envoyer un rappel de facture
  sendReminder: async (id) => {
    try {
      const response = await api.post(`/invoice-reminders/${id}/send`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default InvoiceReminderService; 