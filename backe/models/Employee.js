const pool = require('../config/db');

class Employee {
    static async create(employeeData) {
        const [result] = await pool.query(
            'INSERT INTO employees (firstName, lastName, email, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [
                employeeData.firstName,
                employeeData.lastName,
                employeeData.email,
                employeeData.phone,
                employeeData.role,
                employeeData.status || 'active'
            ]
        );
        return this.getById(result.insertId);
    }

    static async getById(id) {
        const [employees] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        );
        return employees[0];
    }

    static async getAll() {
        const [employees] = await pool.query(
            'SELECT * FROM employees ORDER BY createdAt DESC'
        );
        return employees;
    }

    static async update(id, employeeData) {
        await pool.query(
            'UPDATE employees SET firstName = ?, lastName = ?, email = ?, phone = ?, role = ?, status = ? WHERE id = ?',
            [
                employeeData.firstName,
                employeeData.lastName,
                employeeData.email,
                employeeData.phone,
                employeeData.role,
                employeeData.status,
                id
            ]
        );
        return this.getById(id);
    }

    static async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM employees WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Employee;