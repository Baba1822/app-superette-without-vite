import axios from 'axios';

// URL de l'API backend, récupérée depuis le fichier .env ou utilisée en local par défaut
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fonction de connexion utilisateur
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);

    // Si une réponse contient un token, on le stocke dans le localStorage pour une utilisation future
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    // Retourner la réponse contenant les informations de l'utilisateur ou le token
    return response.data;
  } catch (error) {
    // Gérer les erreurs d'authentification
    console.error('Erreur lors de la connexion', error);
    throw error;
  }
};

// Fonction de déconnexion utilisateur
const logout = () => {
  // Supprimer le token du localStorage
  localStorage.removeItem('token');
};

// Fonction pour obtenir l'utilisateur actuel (décoder le token ou l'utiliser tel quel)
const getCurrentUser = () => {
  // Récupérer le token stocké
  const token = localStorage.getItem('token');
  if (!token) return null;

  // Si tu veux décoder le token, tu peux le faire ici avec une librairie comme jwt-decode
  // Par exemple : return jwtDecode(token);
  return token;
};

// Vérifier si l'utilisateur est authentifié (si le token existe et est valide)
const isAuthenticated = () => {
  const token = getCurrentUser();
  if (!token) return false;

  // Ici, tu pourrais vérifier la validité du token, par exemple en le décodant ou en l'envoyant au backend
  return true;
};

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
