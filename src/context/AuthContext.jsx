import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

/**
 * Provider del contexto de autenticacion.
 *
 * Este proveedor guarda el token y el usuario en localStorage para
 * mantener la sesion entre recargas y expone utilidades basicas.
 *
 * @param {{ children: import("react").ReactNode }} props - Hijo a envolver con el contexto.
 * @returns {JSX.Element} Contenedor del contexto de autenticacion.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sincroniza el token con localStorage cuando cambia.
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  /**
   * Inicia sesion almacenando token y usuario.
   *
   * @param {string} tokenValue - Token JWT devuelto por el backend.
   * @param {object|null} userData - Datos basicos del usuario autenticado.
   */
  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData || null);

    localStorage.setItem("token", tokenValue);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * Cierra sesion limpiando estado y almacenamiento local.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
