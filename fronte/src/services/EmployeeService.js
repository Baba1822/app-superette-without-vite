import axios from 'axios';

class EmployeeService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL;
    }

    // Récupérer tous les employés
    async getAllEmployees() {
        try {
            const response = await axios.get(`${this.apiUrl}/employees`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des employés');
        }
    }

    // Récupérer un employé par ID
    async getEmployeeById(employeeId) {
        try {
            const response = await axios.get(`${this.apiUrl}/employees/${employeeId}`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de l\'employé');
        }
    }

    // Créer un nouvel employé
    async createEmployee(employeeData) {
        try {
            const response = await axios.post(`${this.apiUrl}/employees`, employeeData);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la création de l\'employé');
        }
    }

    // Mettre à jour un employé
    async updateEmployee(employeeId, employeeData) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/employees/${employeeId}`,
                employeeData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de l\'employé');
        }
    }

    // Supprimer un employé
    async deleteEmployee(employeeId) {
        try {
            await axios.delete(`${this.apiUrl}/employees/${employeeId}`);
            return true;
        } catch (error) {
            throw new Error('Erreur lors de la suppression de l\'employé');
        }
    }

    // Mettre à jour les horaires d'un employé
    async updateSchedule(employeeId, scheduleData) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/employees/${employeeId}/schedule`,
                scheduleData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour des horaires');
        }
    }

    // Récupérer les horaires d'un employé
    async getSchedule(employeeId) {
        try {
            const response = await axios.get(`${this.apiUrl}/employees/${employeeId}/schedule`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des horaires');
        }
    }

    // Mettre à jour les permissions d'un employé
    async updatePermissions(employeeId, permissions) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/employees/${employeeId}/permissions`,
                { permissions }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour des permissions');
        }
    }

    // Récupérer les permissions d'un employé
    async getPermissions(employeeId) {
        try {
            const response = await axios.get(`${this.apiUrl}/employees/${employeeId}/permissions`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des permissions');
        }
    }

    // Vérifier si un employé a une permission spécifique
    async checkPermission(employeeId, permission) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/employees/${employeeId}/permissions/${permission}`
            );
            return response.data.hasPermission;
        } catch (error) {
            throw new Error('Erreur lors de la vérification de la permission');
        }
    }

    // Récupérer les présences d'un employé
    async getAttendance(employeeId, startDate, endDate) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/employees/${employeeId}/attendance`,
                {
                    params: { startDate, endDate }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des présences');
        }
    }

    // Enregistrer une présence
    async recordAttendance(employeeId, attendanceData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/employees/${employeeId}/attendance`,
                attendanceData
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'enregistrement de la présence');
        }
    }

    // Générer un rapport des horaires
    async generateScheduleReport(startDate, endDate, format = 'pdf') {
        try {
            const response = await axios.get(
                `${this.apiUrl}/employees/reports/schedule`,
                {
                    params: { startDate, endDate, format },
                    responseType: 'blob'
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la génération du rapport des horaires');
        }
    }

    // Rechercher des employés
    async searchEmployees(query) {
        try {
            const response = await axios.get(`${this.apiUrl}/employees/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la recherche des employés');
        }
    }

    // Récupérer les statistiques des employés
    async getEmployeeStats() {
        try {
            const response = await axios.get(`${this.apiUrl}/employees/stats`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des statistiques');
        }
    }
}

export default new EmployeeService(); 