const Employee = require('../models/Employee');
const { validate } = require('../utils/validators');

exports.createEmployee = async (req, res) => {
    try {
        const employeeId = await Employee.create(req.body);
        res.status(201).json({ id: employeeId });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'employé' });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.getById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employé non trouvé' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'employé' });
    }
};

exports.getEmployeeByEmail = async (req, res) => {
    try {
        const employee = await Employee.getByEmail(req.params.email);
        if (!employee) {
            return res.status(404).json({ error: 'Employé non trouvé' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'employé' });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.getAll(req.query);
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des employés' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        await Employee.update(req.params.id, req.body);
        res.json({ message: 'Employé mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'employé' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.delete(req.params.id);
        res.json({ message: 'Employé supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'employé' });
    }
};

exports.getWorkSchedule = async (req, res) => {
    try {
        const schedule = await Employee.getWorkSchedule(req.params.employeeId, req.params.date);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du planning' });
    }
};

exports.setWorkSchedule = async (req, res) => {
    try {
        await Employee.setWorkSchedule(req.params.employeeId, req.body);
        res.json({ message: 'Planning mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du planning' });
    }
};

exports.updateWorkSchedule = async (req, res) => {
    try {
        await Employee.updateWorkSchedule(req.params.scheduleId, req.body);
        res.json({ message: 'Planning mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du planning' });
    }
};
