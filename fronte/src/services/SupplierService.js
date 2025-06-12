import axios from 'axios';

class SupplierService {
    constructor() {
        this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        this.config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
    }

    async getAllSuppliers() {
        try {
            const response = await axios.get(`${this.apiUrl}/suppliers`, this.config);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error in getAllSuppliers:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch suppliers');
        }
    }

    async getSupplierById(id) {
        try {
            const response = await axios.get(`${this.apiUrl}/suppliers/${id}`, this.config);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error in getSupplierById:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch supplier');
        }
    }

    async createSupplier(supplierData) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/suppliers`, 
                supplierData, 
                this.config
            );
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error in createSupplier:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to create supplier');
        }
    }

    async updateSupplier(id, supplierData) {
        try {
            const response = await axios.put(
                `${this.apiUrl}/suppliers/${id}`,
                supplierData,
                this.config
            );
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error in updateSupplier:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to update supplier');
        }
    }

    async deleteSupplier(id) {
        try {
            const response = await axios.delete(
                `${this.apiUrl}/suppliers/${id}`,
                this.config
            );
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error in deleteSupplier:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to delete supplier');
        }
    }

    async searchSuppliers(query) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/suppliers/search`,
                {
                    ...this.config,
                    params: { q: query }
                }
            );
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error in searchSuppliers:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to search suppliers');
        }
    }
}

export default new SupplierService();