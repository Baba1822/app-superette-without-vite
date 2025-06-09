const pool = require('../config/db');

class Expense {
    static async createExpense(expenseData) {
        const [result] = await pool.query(
            'INSERT INTO depenses (type, description, montant, date_depense, categorie, reference, utilisateur_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [expenseData.type, expenseData.description, expenseData.montant, expenseData.date_depense,
             expenseData.categorie, expenseData.reference, expenseData.utilisateur_id]
        );
        return result.insertId;
    }

    static async getExpenseById(id) {
        const [expenses] = await pool.query(
            'SELECT e.*, u.nom as utilisateur_nom FROM depenses e ' +
            'LEFT JOIN utilisateurs u ON e.utilisateur_id = u.id ' +
            'WHERE e.id = ?',
            [id]
        );
        return expenses[0];
    }

    static async getExpenses(filters = {}) {
        let query = 'SELECT e.*, u.nom as utilisateur_nom FROM depenses e ' +
                   'LEFT JOIN utilisateurs u ON e.utilisateur_id = u.id';
        const params = [];

        if (filters.startDate) {
            query += ' WHERE date_depense >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' date_depense <= ?';
            params.push(filters.endDate);
        }

        if (filters.type) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' type = ?';
            params.push(filters.type);
        }

        query += ' ORDER BY date_depense DESC';

        const [expenses] = await pool.query(query, params);
        return expenses;
    }

    static async updateExpense(id, expenseData) {
        await pool.query(
            'UPDATE depenses SET type = ?, description = ?, montant = ?, date_depense = ?, ' +
            'categorie = ?, reference = ?, utilisateur_id = ? WHERE id = ?',
            [expenseData.type, expenseData.description, expenseData.montant, expenseData.date_depense,
             expenseData.categorie, expenseData.reference, expenseData.utilisateur_id, id]
        );
    }

    static async deleteExpense(id) {
        await pool.query('DELETE FROM depenses WHERE id = ?', [id]);
    }

    static async getExpenseReport(filters = {}) {
        let query = 'SELECT DATE(date_depense) as date, SUM(montant) as total, type, categorie ' +
                   'FROM depenses WHERE 1 = 1';
        const params = [];

        if (filters.startDate) {
            query += ' AND date_depense >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND date_depense <= ?';
            params.push(filters.endDate);
        }

        if (filters.type) {
            query += ' AND type = ?';
            params.push(filters.type);
        }

        query += ' GROUP BY DATE(date_depense), type, categorie ORDER BY date DESC';

        const [report] = await pool.query(query, params);
        return report;
    }
}

module.exports = Expense;
