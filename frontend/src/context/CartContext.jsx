import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, session } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState('');

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      setError('');
      return;
    }
    try {
      const result = await api('/cart');
      setCart(result);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart, session?.accessToken]);

  const value = useMemo(
    () => ({
      cart,
      error,
      refreshCart,
      addItem: async (productId, quantity = 1) => {
        const result = await api('/cart', { method: 'POST', body: { productId, quantity } });
        setCart(result);
        setError('');
      },
      setQuantity: async (productId, quantity) => {
        const result = await api(`/cart/${productId}`, { method: 'PATCH', body: { quantity } });
        setCart(result);
        setError('');
      },
      removeItem: async (productId) => {
        const result = await api(`/cart/${productId}`, { method: 'DELETE' });
        setCart(result);
        setError('');
      },
      clearCart: () => setCart({ items: [] }),
    }),
    [cart, error, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
