import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem(`favorites_${user?.id}`);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    if (isAuthenticated() && user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated, user]);

  const toggleFavorite = (productId) => {
    setFavorites(currentFavorites => {
      const isFavorite = currentFavorites.includes(productId);
      const newFavorites = isFavorite
        ? currentFavorites.filter(id => id !== productId)
        : [...currentFavorites, productId];
      
      toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
      return newFavorites;
    });
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.info('Liste des favoris vidée');
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 