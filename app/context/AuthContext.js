"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd"; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- LOGIN: Fetch ke API Login ---
  const login = async (username, password) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Jika password salah (401), lempar error agar ditangkap catch
        throw new Error(data.message || "Gagal Login");
      }

      // Login Sukses
      const userData = { 
        name: data.user.fullname, 
        username: data.user.username, 
        role: data.user.role 
      };

      setUser(userData);
      localStorage.setItem("user_data", JSON.stringify(userData));
      setIsLoginModalOpen(false); // Tutup modal
      message.success(`Selamat datang, ${userData.name}!`);

    } catch (error) {
      message.error(error.message); // Tampilkan error "Username salah" disini
    }
  };

  // --- REGISTER: Fetch ke API Register ---
  const register = async (values) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: values.fullname,
          username: values.username,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal Registrasi");
      }

      // Register Sukses -> Auto Login
      const newUser = { 
        name: data.user.fullname, 
        username: data.user.username, 
        role: "member" 
      };

      setUser(newUser);
      localStorage.setItem("user_data", JSON.stringify(newUser));
      setIsLoginModalOpen(false);
      message.success("Registrasi Berhasil! Akun tersimpan.");

    } catch (error) {
      message.error(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_data");
    message.info("Berhasil Logout");
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user, isLoggedIn: !!user,
        login, register, logout,
        isLoginModalOpen, openLoginModal, closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};