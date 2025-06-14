const express = require('express');
const router = express.Router();
const {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');

// Routes pour /api/employees
router.route('/')
    .get(getAllEmployees)
    .post(createEmployee);

router.route('/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;