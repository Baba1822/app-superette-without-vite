import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class EmployeeService {
    async getAll() {
        try {
            const response = await axios.get(`${API_URL}/employees`);
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async create(employeeData) {
        try {
            const response = await axios.post(`${API_URL}/employees`, employeeData);
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async update(id, employeeData) {
        try {
            const response = await axios.put(`${API_URL}/employees/${id}`, employeeData);
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async delete(id) {
        try {
            await axios.delete(`${API_URL}/employees/${id}`);
            return true;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        console.error('API Error:', error.response?.data);
        const message = error.response?.data?.error || 
                       error.message || 
                       'Une erreur inconnue est survenue';
        return new Error(message);
    }
}

export default new EmployeeService();