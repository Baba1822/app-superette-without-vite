import { useState, useEffect } from 'react';

// Clé pour stocker le token dans localStorage
const AUTH_TOKEN_KEY = 'token';

// Fonction pour obtenir le header d'authentification
export const getAuthHeader = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? `Bearer ${token}` : null;
};

// Fonction pour sauvegarder le token
export const saveAuthToken = (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// Fonction pour supprimer le token
export const clearAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Hook personnalisé pour la gestion de l'authentification
export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Vérifier immédiatement si le token existe
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        setIsAuthenticated(true);
    }

    useEffect(() => {
        // Double vérification au cas où
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    const login = (token) => {
        saveAuthToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        clearAuthToken();
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        loading,
        login,
        logout
    };
};
