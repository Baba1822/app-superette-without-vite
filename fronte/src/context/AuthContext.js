import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

const getRedirectPath = (userRole, from = null, redirectUrl = null) => {
  // Si une redirection spécifique était prévue (from), on la respecte
  if (from && from !== '/login' && from !== '/register' && from !== '/connexion') {
    return from;
  }

  // Si on a un redirectUrl spécifique, on l'utilise
  if (redirectUrl) {
    return redirectUrl;
  }

  // Redirection basée sur le rôle selon vos routes définies
  switch (userRole) {
    case 'admin':
      return '/administration';
    case 'client':
      return '/Shop';
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

export { getRedirectPath };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Vérification initiale du token
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser({
            id: decoded.id,
            email: decoded.email,
            prenom: decoded.prenom,
            nom: decoded.nom,
            type: decoded.type || decoded.role
          });
        } catch (error) {
          console.error('Erreur de décodage du token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

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

  const login = async (credentials) => {
    try {
      if (!credentials.email || !credentials.motdepasse) {
        throw new Error('Email et mot de passe sont requis');
      }

      const loginData = {
        email: credentials.email.trim(),
        motdepasse: credentials.motdepasse
      };

      setLoading(true);
      
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: loginData
      });

      setLoading(false);

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setUser(response.user);
        setError('');
        
        // CORRECTION: Calculer le redirectPath ici si pas fourni par le serveur
        const redirectPath = response.redirectPath || getRedirectPath(response.user.type);
        
        return { 
          success: true, 
          user: response.user,
          redirectPath: redirectPath
        };
      } else {
        throw new Error(response.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur login:', error);
      const errorMessage = error.message || 'Email ou mot de passe incorrect';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
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

      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: userData
      });

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setUser(response.user);
        setError('');
        toast.success('Inscription réussie !');

        // CORRECTION: Retourner les données pour permettre la navigation côté composant
        // au lieu d'utiliser window.location.href
        const redirectPath = response.redirectUrl || getRedirectPath(response.user.type);

        return { 
          success: true, 
          user: response.user,
          redirectUrl: redirectPath
        };
      } else {
        throw new Error(response.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur register:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
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

      const response = await apiRequest('/api/auth/refresh', {
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
              type: newDecoded.type || newDecoded.role // CORRECTION: Support pour type et role
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
            type: decoded.type || decoded.role // CORRECTION: Support pour type et role
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification auth:', error);
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