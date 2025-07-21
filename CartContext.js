// CartContext.js
import React, { createContext, useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
export const CartContext = createContext();

// Create the provider
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  
useEffect(() => {
  const loadCartCount = async () => {
    const stored = await AsyncStorage.getItem('Count');
    console.log("stored=====>",stored);
    if (stored !== null) setCartCount(JSON.parse(stored));
  };
  loadCartCount();
}, []);

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      {children}
    </CartContext.Provider>
  );
};