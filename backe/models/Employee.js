const pool = require('../config/db');

class Employee {
    static async create(employeeData) {
        const [result] = await pool.query(
            'INSERT INTO employes (nom, prenom, email, telephone, adresse, role, date_embauche, salaire, status) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)',
            [employeeData.nom, employeeData.prenom, employeeData.email, employeeData.telephone, 
             employeeData.adresse, employeeData.role, employeeData.salaire, employeeData.status]
        );
        return result.insertId;
    }

    static async getById(id) {
        const [employees] = await pool.query(
            'SELECT * FROM employes WHERE id = ?',
            [id]
        );
        return employees[0];
    }

    static async getByEmail(email) {
        const [employees] = await pool.query(
            'SELECT * FROM employes WHERE email = ?',
            [email]
        );
        return employees[0];
    }

    static async getAll(filters = {}) {
        let query = 'SELECT e.*, r.nom as role_name FROM employes e LEFT JOIN roles r ON e.role = r.id';
        const params = [];

        if (filters.role) {
            query += ' WHERE e.role = ?';
            params.push(filters.role);
        }

        if (filters.status) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' e.status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY e.date_embauche DESC';

        const [employees] = await pool.query(query, params);
        return employees;
    }

    static async update(id, employeeData) {
        await pool.query(
            'UPDATE employes SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?, ' +
            'role = ?, salaire = ?, status = ? WHERE id = ?',
            [employeeData.nom, employeeData.prenom, employeeData.email, employeeData.telephone,
             employeeData.adresse, employeeData.role, employeeData.salaire, employeeData.status, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM employes WHERE id = ?', [id]);
    }

    static async getWorkSchedule(employeeId, date) {
        const [schedules] = await pool.query(
            'SELECT * FROM planning WHERE employee_id = ? AND date = ?',
            [employeeId, date]
        );
        return schedules[0];
    }

    static async setWorkSchedule(employeeId, scheduleData) {
        await pool.query(
            'INSERT INTO planning (employee_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)',
            [employeeId, scheduleData.date, scheduleData.start_time, scheduleData.end_time, scheduleData.status]
        );
    }

    static async updateWorkSchedule(scheduleId, scheduleData) {
        await pool.query(
            'UPDATE planning SET start_time = ?, end_time = ?, status = ? WHERE id = ?',
            [scheduleData.start_time, scheduleData.end_time, scheduleData.status, scheduleId]
        );
    }
}

module.exports = Employee;
