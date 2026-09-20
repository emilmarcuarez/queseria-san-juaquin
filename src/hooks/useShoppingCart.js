import { useContext } from 'react';
import { ShoppingCartContext } from '../context/ShoppingCartContext';

export const useShoppingCart = () => {
  const shoppingCartContextValue = useContext(ShoppingCartContext);

  if (!shoppingCartContextValue) {
    throw new Error('useShoppingCart debe ser utilizado dentro de ShoppingCartProvider');
  }

  return shoppingCartContextValue;
};
