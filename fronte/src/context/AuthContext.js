import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiRequest = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers
        },
        ...options
      };

      if (options.body) {
        config.body = JSON.stringify(options.body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(responseData.message || `Erreur HTTP: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Fonction pour déterminer la redirection basée sur le rôle
  const getRedirectPath = (userRole, from = null) => {
    // Si une redirection spécifique était prévue (from), on la respecte
    if (from && from !== '/login' && from !== '/register' && from !== '/connexion') {
      return from;
    }

    // Redirection basée sur le rôle selon vos routes définies
    switch (userRole) {
      case 'admin':
        return '/administration'; // Route vers AdminLayout avec Dashboard par défaut
      case 'client':
        return '/boutique'; // Route vers Shop dans CustomerLayout
      case 'cashier':
        return '/caisse';
      case 'stockist':
        return '/inventaire';
      case 'manager':
        return '/finances';
      default:
        return '/';
    }
  };

  const login = async (credentials) => {
    try {
      if (!credentials.email || !credentials.motdepasse) {
        throw new Error('Email et mot de passe sont requis');
      }

      const loginData = {
        email: credentials.email.toLowerCase().trim(),
        motdepasse: credentials.motdepasse
      };

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: loginData
      });

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setUser(response.user);
        setError('');
        toast.success('Connexion réussie !');
        
        // Retourner les informations de redirection basées sur le rôle
        return { 
          success: true, 
          user: response.user,
          redirectPath: getRedirectPath(response.user.role)
        };
      } else {
        throw new Error(response.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur login:', error);
      const errorMessage = error.message || 'Email ou mot de passe incorrect';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      if (!userData.prenom || !userData.email || !userData.motdepasse) {
        throw new Error('Prénom, email et mot de passe sont requis');
      }

      if (userData.motdepasse.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      const registerData = {
        prenom: userData.prenom.trim(),
        nom: userData.nom ? userData.nom.trim() : '',
        email: userData.email.toLowerCase().trim(),
        telephone: userData.telephone ? userData.telephone.trim() : '',
        motdepasse: userData.motdepasse,
        role: 'client'
      };

      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: registerData
      });

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setUser(response.user);
        setError('');
        toast.success('Inscription réussie !');
        
        // Retourner les informations de redirection basées sur le rôle
        return { 
          success: true, 
          user: response.user,
          redirectPath: getRedirectPath(response.user.role)
        };
      } else {
        throw new Error(response.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur register:', error);
      setError(error.message);
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setError('');
    toast.success('Déconnexion réussie !');
  };

  const refreshTokenFunc = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Pas de refresh token');
      }

      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: { refreshToken }
      });

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        return response.token;
      } else {
        throw new Error('Impossible de rafraîchir le token');
      }
    } catch (error) {
      console.error('Erreur refresh token:', error);
      logout();
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        
        if (decoded.exp <= now) {
          try {
            await refreshTokenFunc();
            const newDecoded = jwtDecode(localStorage.getItem('token'));
            setUser({
              id: newDecoded.id,
              email: newDecoded.email,
              prenom: newDecoded.prenom,
              nom: newDecoded.nom,
              role: newDecoded.role
            });
          } catch (refreshError) {
            logout();
          }
        } else {
          setUser({
            id: decoded.id,
            email: decoded.email,
            prenom: decoded.prenom,
            nom: decoded.nom,
            role: decoded.role
          });
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      apiRequest,
      refreshToken: refreshTokenFunc,
      isAuthenticated: !!user,
      getRedirectPath
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};