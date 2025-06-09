const pool = require('../config/db');

class FinancialReport {
    static async getSalesReport(startDate, endDate) {
        const [sales] = await pool.query(
            'SELECT DATE_FORMAT(date_vente, %Y-%m-%d) as date, SUM(montant_total) as total, COUNT(*) as nb_ventes ' +
            'FROM ventes WHERE date_vente BETWEEN ? AND ? GROUP BY DATE_FORMAT(date_vente, %Y-%m-%d)',
            [startDate, endDate]
        );
        return sales;
    }

    static async getExpensesReport(startDate, endDate) {
        const [expenses] = await pool.query(
            'SELECT DATE_FORMAT(date_depense, %Y-%m-%d) as date, SUM(montant) as total, categorie ' +
            'FROM depenses WHERE date_depense BETWEEN ? AND ? GROUP BY DATE_FORMAT(date_depense, %Y-%m-%d), categorie',
            [startDate, endDate]
        );
        return expenses;
    }

    static async getProfitReport(startDate, endDate) {
        const [sales] = await pool.query(
            'SELECT SUM(montant_total) as total_ventes FROM ventes WHERE date_vente BETWEEN ? AND ?',
            [startDate, endDate]
        );
        
        const [expenses] = await pool.query(
            'SELECT SUM(montant) as total_depenses FROM depenses WHERE date_depense BETWEEN ? AND ?',
            [startDate, endDate]
        );

        return {
            total_ventes: sales[0]?.total_ventes || 0,
            total_depenses: expenses[0]?.total_depenses || 0,
            benefice: (sales[0]?.total_ventes || 0) - (expenses[0]?.total_depenses || 0)
        };
    }

    static async getInventoryValue() {
        const [inventory] = await pool.query(
            'SELECT SUM(stock * prix_achat) as valeur_total FROM produits'
        );
        return inventory[0];
    }
}

module.exports = FinancialReport;
