import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
    staleTime: 1000 * 60 * 5,
    onError: (err) => {
      console.error('Erreur lors du chargement des commandes via useOrders hook:', err);
    },
  });

  return { orders: data, isLoading, isError, error };
};
