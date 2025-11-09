// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData || null);

    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated:!!token}}>
      {children}
    </AuthContext.Provider>
  );
}
