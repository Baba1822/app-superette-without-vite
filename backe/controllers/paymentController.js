const Payment = require('../models/Payment');
const { validate } = require('../utils/validators');

exports.createPayment = async (req, res) => {
    try {
        const paymentId = await Payment.createPayment(req.body);
        res.status(201).json({ id: paymentId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du paiement' });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.getPaymentById(req.params.id);
        if (!payment) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du paiement' });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.getPayments(req.query);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des paiements' });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const success = await Payment.updatePaymentStatus(
            req.params.id,
            req.body.status,
            req.body.note
        );
        if (!success) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        res.json({ message: 'Statut du paiement mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
};

exports.createInstallment = async (req, res) => {
    try {
        const installmentId = await Payment.createInstallmentPayment(req.body);
        res.status(201).json({ id: installmentId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'échéance' });
    }
};

exports.updateInstallmentStatus = async (req, res) => {
    try {
        const success = await Payment.updateInstallmentStatus(
            req.params.id,
            req.body.status,
            req.body.note
        );
        if (!success) {
            return res.status(404).json({ error: 'Échéance non trouvée' });
        }
        res.json({ message: 'Statut de l\'échéance mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
};

exports.getInstallments = async (req, res) => {
    try {
        const installments = await Payment.getInstallments(req.params.paymentId);
        res.json(installments);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des échéances' });
    }
};
