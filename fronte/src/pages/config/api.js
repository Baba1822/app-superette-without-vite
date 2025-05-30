// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const endpoints = {
  products: `${API_BASE_URL}/api/products`,
  categories: `${API_BASE_URL}/api/categories`,
  locations: `${API_BASE_URL}/api/locations`
};

export default {
  API_BASE_URL,
  endpoints
};