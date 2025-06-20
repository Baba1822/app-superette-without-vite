import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import wsClient from '../services/WebSocketClient';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [newProductAdded, setNewProductAdded] = useState(null);
  const [stockUpdated, setStockUpdated] = useState(null);

  useEffect(() => {
    const unsubscribe = wsClient.subscribe('product-update', (update) => {
      console.log('Received product update via WebSocket:', update);
      
      // Invalidate queries to refetch product data
      queryClient.invalidateQueries({ queryKey: ['products'] });

      if (update.action === 'created') {
        setNewProductAdded(update.product);
      } else if (update.action === 'updated' && update.product.stock !== undefined) {
        setStockUpdated(update.product);
      }
    });

    return () => {
      console.log('Unsubscribing from product updates.');
      unsubscribe();
    };
  }, [queryClient]);

  const clearNewProduct = () => {
    setNewProductAdded(null);
  };

  const clearStockUpdate = () => {
    setStockUpdated(null);
  };

  return (
    <ProductContext.Provider value={{ 
      newProductAdded, 
      clearNewProduct,
      stockUpdated,
      clearStockUpdate
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);