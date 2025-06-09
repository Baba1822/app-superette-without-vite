import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// URL de l'API backend, récupérée depuis le fichier .env ou utilisée en local par défaut
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fonction de connexion utilisateur
const login = async (credentials) => {
  try {
    // CORRECTION: Utiliser le bon endpoint
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Décoder le token pour obtenir les informations de l'utilisateur
      const decoded = jwtDecode(response.data.token);
      localStorage.setItem('user', JSON.stringify(decoded));
    }
    
    return response.data;
  } catch (error) {
    // Gérer les erreurs d'authentification
    console.error('Erreur lors de la connexion', error);
    if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      throw new Error(error.response.data?.message || 'Erreur de connexion');
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      throw new Error('Impossible de se connecter au serveur');
    } else {
      // Erreur dans la configuration de la requête
      throw new Error('Erreur lors de la requête');
    }
  }
};

// Fonction d'inscription utilisateur
const register = async (userData) => {
  try {
    // CORRECTION: Utiliser le bon endpoint
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Décoder le token pour obtenir les informations de l'utilisateur
      const decoded = jwtDecode(response.data.token);
      localStorage.setItem('user', JSON.stringify(decoded));
    }
    
    return response.data;
  } catch (error) {
    // Gérer les erreurs d'inscription
    console.error('Erreur lors de l\'inscription', error);
    if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      throw new Error(error.response.data?.message || 'Erreur d\'inscription');
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      throw new Error('Impossible de se connecter au serveur');
    } else {
      // Erreur dans la configuration de la requête
      throw new Error('Erreur lors de la requête');
    }
  }
};

// Fonction de déconnexion utilisateur
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Fonction pour obtenir l'utilisateur actuel
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Vérifier si le token est expiré
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Fonction pour obtenir le token avec vérification d'expiration
const getValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp <= currentTime) {
      // Token expiré, nettoyer le localStorage
      logout();
      return null;
    }
    
    return token;
  } catch (error) {
    // Token invalide, nettoyer le localStorage
    logout();
    return null;
  }
};

// Intercepteur pour ajouter automatiquement le token aux requêtes
axios.interceptors.request.use(
  (config) => {
    const token = getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses d'erreur (notamment les 401)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      logout();
      // Optionnel: rediriger vers la page de connexion
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getValidToken,
};