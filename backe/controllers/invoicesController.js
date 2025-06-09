const Invoices = require('../models/Invoices');
const { validate } = require('../utils/validators');

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoices.getInvoices(req.query);
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
    }
};

exports.createInvoice = async (req, res) => {
    try {
        const invoiceId = await Invoices.createInvoice(req.body);
        await Invoices.addInvoiceDetails(invoiceId, req.body.items);
        res.status(201).json({ id: invoiceId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la facture' });
    }
};

exports.updateInvoiceStatus = async (req, res) => {
    try {
        await Invoices.updateInvoiceStatus(req.params.invoiceId, req.body.status);
        res.json({ message: 'Statut de la facture mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoices.getInvoiceById(req.params.invoiceId);
        if (!invoice) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la facture' });
    }
};

exports.generateInvoicePDF = async (req, res) => {
    try {
        const pdf = await Invoices.generateInvoicePDF(req.params.invoiceId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${pdf.filename}`);
        res.send(pdf.content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
