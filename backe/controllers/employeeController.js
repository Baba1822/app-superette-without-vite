const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.getAll();
        res.json({ 
            success: true,
            data: employees 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: 'Erreur serveur lors de la récupération des employés' 
        });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const requiredFields = ['firstName', 'lastName', 'email', 'role'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    error: `Le champ ${field} est requis`
                });
            }
        }

        const employee = await Employee.create(req.body);
        res.status(201).json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur lors de la création de l\'employé'
        });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.update(req.params.id, req.body);
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: 'Employé non trouvé'
            });
        }
        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur lors de la mise à jour de l\'employé'
        });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const success = await Employee.delete(req.params.id);
        if (!success) {
            return res.status(404).json({
                success: false,
                error: 'Employé non trouvé'
            });
        }
        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur lors de la suppression de l\'employé'
        });
    }
};