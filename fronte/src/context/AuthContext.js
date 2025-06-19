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

  // Fonction pour vérifier la validité du token
  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    console.log('isTokenValid: Vérification du token...', { tokenExists: !!token });
    if (!token) {
      console.log('isTokenValid: Aucun token trouvé.');
      return false;
    }
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const isValid = decoded.exp > currentTime;
      console.log('isTokenValid: Token décodé:', decoded);
      console.log(`isTokenValid: Expire à ${new Date(decoded.exp * 1000).toLocaleString()}, Actuel: ${new Date(currentTime * 1000).toLocaleString()}, Valide: ${isValid}`);
      return isValid;
    } catch (error) {
      console.error('isTokenValid: Erreur de décodage du token:', error);
      return false;
    }
  };

  // Vérification initiale du token
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // Toujours mettre loading à true au début
      try {
        const token = localStorage.getItem('token');
        console.log('checkAuth: Début de la vérification, token trouvé:', !!token);
        if (!token) {
          setLoading(false);
          console.log('checkAuth: Pas de token, fin du chargement.');
          return;
        }

        // Vérifier si le token est valide
        if (!isTokenValid()) {
          console.log('checkAuth: Token non valide ou expiré, tentative de rafraîchissement...');
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            console.log('checkAuth: Refresh token trouvé:', !!refreshToken);
            if (refreshToken) {
              const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
              });

              if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                if (data.refreshToken) { // Assurez-vous de stocker le nouveau refresh token si le backend le renvoie
                  localStorage.setItem('refreshToken', data.refreshToken);
                }
                const decoded = jwtDecode(data.token);
                setUser({
                  id: decoded.id,
                  email: decoded.email,
                  prenom: decoded.prenom,
                  nom: decoded.nom,
                  type: decoded.type || decoded.role
                });
                console.log('checkAuth: Token et refresh token rafraîchis avec succès.');
              } else {
                console.error('checkAuth: Échec du rafraîchissement du token.');
                logout();
              }
            } else {
              console.log('checkAuth: Pas de refresh token, déconnexion...');
              logout();
            }
          } catch (error) {
            console.error('checkAuth: Erreur lors du rafraîchissement du token:', error);
            logout();
          }
          return;
        }

        // Token valide, continuer
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          email: decoded.email,
          prenom: decoded.prenom,
          nom: decoded.nom,
          type: decoded.type || decoded.role
        });
        console.log('checkAuth: Token valide, utilisateur défini.');
      } catch (error) {
        console.error('checkAuth: Erreur de décodage du token dans useEffect:', error);
        logout();
      } finally {
        setLoading(false);
        console.log('checkAuth: Fin du chargement.');
      }
    };

    checkAuth();
  }, []);

  const apiRequest = async (endpoint, options = {}) => {
    try {
      // Utiliser l'endpoint complet avec le proxy
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      };

      if (options.body) {
        config.body = JSON.stringify(options.body);
      }

      // Ajouter le préfixe /api si nécessaire
      const fullEndpoint = endpoint.startsWith('/') ? endpoint : `/api${endpoint}`;

      // Ajouter le token dans le header si disponible
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      }

      // Utiliser le proxy configuré dans package.json
      const response = await fetch(fullEndpoint, {
        ...config,
        credentials: 'include'
      });

      // Vérifier si la requête a réussi
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message || 
            errorData.error || 
            `Erreur HTTP ${response.status}: ${response.statusText}`
          );
        } catch (parseError) {
          const text = await response.text();
          throw new Error(`Erreur serveur: ${text}`);
        }
      }

      const responseData = await response.json();
      console.log('Réponse brute:', responseData);
      return responseData;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le serveur backend est en cours d\'exécution.');
      }
      
      console.error('API Error Details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
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
      
      try {
        const response = await apiRequest('/api/auth/login', {
          method: 'POST',
          body: loginData
        });

        // Vérifier si c'est une réponse d'erreur du backend
        if (response?.error) {
          throw new Error(response.error);
        }

        if (!response?.success || !response?.token) {
          throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.');
        }

        // Connexion réussie
        localStorage.setItem('token', response.token);
        if (response.refreshToken) { // Assurez-vous de stocker le refresh token ici aussi
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setUser(response.user);
        setError('');
        toast.success('Connexion réussie !');
        console.log('Login: Token stocké et utilisateur défini.');
        return {
          success: true,
          token: response.token,
          user: response.user
        };
      } catch (error) {
        console.error('Erreur de connexion:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          status: error.status,
          response: error.response
        });
        
        // Afficher le message d'erreur détaillé
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Erreur de connexion au serveur';
        toast.error(errorMessage);
        throw error;
      }
    } catch (error) {
      console.error('Erreur login:', error);
      const errorMessage = error.message || 'Email ou mot de passe incorrect';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
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

        // Récupérer la redirection depuis le response ou utiliser le chemin par défaut
        const redirectPath = response.redirectUrl || getRedirectPath(response.user.type);
        
        return {
          success: true,
          token: response.token,
          user: response.user,
          redirectPath
        };

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