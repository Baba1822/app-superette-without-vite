const express = require('express');
const router = express.Router();
const { validate } = require('../utils/validators');
const { createEmployee, getEmployeeById, getEmployeeByEmail, getAllEmployees, updateEmployee, deleteEmployee, getWorkSchedule, setWorkSchedule, updateWorkSchedule } = require('../controllers/employeeController');

// Routes pour les employés
router.post('/', validate, createEmployee);
router.get('/:id', getEmployeeById);
router.get('/email/:email', getEmployeeByEmail);
router.get('/', getAllEmployees);
router.put('/:id', validate, updateEmployee);
router.delete('/:id', deleteEmployee);

// Planning
router.get('/:employeeId/schedule/:date', getWorkSchedule);
router.post('/:employeeId/schedule', validate, setWorkSchedule);
router.put('/schedule/:scheduleId', validate, updateWorkSchedule);

module.exports = router;
