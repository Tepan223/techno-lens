"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [cart, setCart] = useState([]);

  // Tentukan nama key penyimpanan
  const storageKey = isLoggedIn && user?.username 
    ? `cart_${user.username}` 
    : "cart_guest";

  // Debugging: Cek di Console browser
  useEffect(() => {
    console.log("--- DEBUG CART ---");
    console.log("User saat ini:", user ? user.username : "Guest");
    console.log("Storage Key yang dipakai:", storageKey);
  }, [user, storageKey]);

  // Load Data saat Key berubah
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem(storageKey);
      console.log(`Loading data dari ${storageKey}...`, storedCart);
      
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]); // Reset jadi kosong jika data belum ada
      }
    }
  }, [storageKey]);

  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem(storageKey, JSON.stringify(newCart));
    console.log(`Menyimpan ke ${storageKey}:`, newCart);
  };

  const addToCart = (item) => {
    const newCart = [...cart, item];
    saveCartToStorage(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};