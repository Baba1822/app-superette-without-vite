import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// URL de l'API backend, récupérée depuis le fichier .env ou utilisée en local par défaut
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fonction de connexion utilisateur
const login = async (credentials) => {
  try {
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

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
