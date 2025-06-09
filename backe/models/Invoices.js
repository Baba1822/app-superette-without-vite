const pool = require('../config/db');

class Invoices {
    static async getInvoices(filters = {}) {
        let query = `SELECT f.*, c.nom as client_nom, c.email as client_email,
            c.telephone as client_telephone, e.nom as employe_nom,
            GROUP_CONCAT(DISTINCT p.nom) as produits,
            SUM(di.montant_total) as total_facture
            FROM factures f
            LEFT JOIN clients c ON f.client_id = c.id
            LEFT JOIN employes e ON f.employe_id = e.id
            LEFT JOIN details_facture di ON f.id = di.facture_id
            LEFT JOIN produits p ON di.produit_id = p.id
            WHERE 1 = 1`;
        const params = [];

        if (filters.startDate) {
            query += ' AND f.date_facture >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND f.date_facture <= ?';
            params.push(filters.endDate);
        }

        if (filters.clientId) {
            query += ' AND f.client_id = ?';
            params.push(filters.clientId);
        }

        if (filters.status) {
            query += ' AND f.statut = ?';
            params.push(filters.status);
        }

        query += ' GROUP BY f.id ORDER BY f.date_facture DESC';

        const [invoices] = await pool.query(query, params);
        return invoices;
    }

    static async createInvoice(invoiceData) {
        const [result] = await pool.query(
            'INSERT INTO factures (client_id, employe_id, date_facture, ' +
            'statut, methode_paiement, reference, commentaire) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?)',
            [invoiceData.clientId, invoiceData.employeId, invoiceData.dateFacture,
             invoiceData.statut, invoiceData.methodePaiement, invoiceData.reference,
             invoiceData.commentaire]
        );
        return result.insertId;
    }

    static async addInvoiceDetails(invoiceId, items) {
        for (const item of items) {
            await pool.query(
                'INSERT INTO details_facture (facture_id, produit_id, quantite, ' +
                'prix_unitaire, montant_total) VALUES (?, ?, ?, ?, ?)',
                [invoiceId, item.produitId, item.quantite, item.prixUnitaire,
                 item.montantTotal]
            );
        }
    }

    static async updateInvoiceStatus(invoiceId, status) {
        await pool.query(
            'UPDATE factures SET statut = ?, date_statut = NOW() WHERE id = ?',
            [status, invoiceId]
        );
    }

    static async getInvoiceById(id) {
        const [invoice] = await pool.query(
            `SELECT f.*, c.nom as client_nom, c.email as client_email,
                c.telephone as client_telephone, e.nom as employe_nom,
                GROUP_CONCAT(DISTINCT p.nom) as produits,
                SUM(di.montant_total) as total_facture
                FROM factures f
                LEFT JOIN clients c ON f.client_id = c.id
                LEFT JOIN employes e ON f.employe_id = e.id
                LEFT JOIN details_facture di ON f.id = di.facture_id
                LEFT JOIN produits p ON di.produit_id = p.id
                WHERE f.id = ?
                GROUP BY f.id`,
            [id]
        );
        return invoice[0];
    }

    static async generateInvoicePDF(invoiceId) {
        const invoice = await this.getInvoiceById(invoiceId);
        if (!invoice) {
            throw new Error('Facture non trouvée');
        }

        // Génération du PDF (à implémenter avec une bibliothèque comme pdfkit)
        // ...

        return {
            filename: `facture_${invoice.reference}.pdf`,
            content: Buffer.from('PDF content') // À remplacer par la génération réelle
        };
    }
}

module.exports = Invoices;
