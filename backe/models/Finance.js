const pool = require('../config/db');

class Finance {
    static async getExpenses(filters = {}) {
        let query = 'SELECT e.*, c.nom as categorie_nom, u.nom as utilisateur_nom ' +
                   'FROM depenses e ' +
                   'LEFT JOIN categories_depenses c ON e.categorie_id = c.id ' +
                   'LEFT JOIN utilisateurs u ON e.utilisateur_id = u.id ' +
                   'WHERE 1 = 1';
        const params = [];

        if (filters.startDate) {
            query += ' AND e.date_depense >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND e.date_depense <= ?';
            params.push(filters.endDate);
        }

        if (filters.categoryId) {
            query += ' AND e.categorie_id = ?';
            params.push(filters.categoryId);
        }

        query += ' ORDER BY e.date_depense DESC';

        const [expenses] = await pool.query(query, params);
        return expenses;
    }

    static async createExpense(expenseData) {
        const [result] = await pool.query(
            'INSERT INTO depenses (type, description, montant, date_depense, ' +
            'categorie_id, reference, utilisateur_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [expenseData.type, expenseData.description, expenseData.montant,
             expenseData.dateDepense, expenseData.categorieId, expenseData.reference,
             expenseData.utilisateurId]
        );
        return result.insertId;
    }

    static async getExpenseReport(filters = {}) {
        let query = 'SELECT DATE(date_depense) as date, SUM(montant) as total, ' +
                   'categorie_id, c.nom as categorie_nom ' +
                   'FROM depenses e ' +
                   'LEFT JOIN categories_depenses c ON e.categorie_id = c.id ' +
                   'WHERE 1 = 1';
        const params = [];

        if (filters.startDate) {
            query += ' AND e.date_depense >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND e.date_depense <= ?';
            params.push(filters.endDate);
        }

        query += ' GROUP BY DATE(date_depense), categorie_id ' +
                 'ORDER BY date DESC';

        const [report] = await pool.query(query, params);
        return report;
    }

    static async getFinancialSummary(filters = {}) {
        const [summary] = await pool.query(
            `SELECT 
                (SELECT SUM(montant) FROM depenses WHERE DATE(date_depense) = CURDATE()) as depenses_jour,
                (SELECT SUM(montant_total) FROM commandes WHERE DATE(date_creation) = CURDATE() AND statut = 'terminee') as ventes_jour,
                (SELECT SUM(montant) FROM depenses WHERE DATE(date_depense) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()) as depenses_mois,
                (SELECT SUM(montant_total) FROM commandes WHERE DATE(date_creation) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE() AND statut = 'terminee') as ventes_mois,
                (SELECT COUNT(*) FROM commandes WHERE DATE(date_creation) = CURDATE() AND statut = 'terminee') as commandes_jour,
                (SELECT COUNT(*) FROM commandes WHERE DATE(date_creation) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE() AND statut = 'terminee') as commandes_mois
            `);
        return summary[0];
    }
}

module.exports = Finance;
