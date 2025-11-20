import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

/**
 * Provider para el contexto de autenticación.
 * 
 * Este proveedor gestiona el estado de autenticación del usuario y
 * proporciona funciones para iniciar sesión y cerrar sesión.
 * 
 * El proveedor devuelve un objeto con las siguientes propiedades:
 * - `token`: el token JWT del usuario autenticado.
 * - `user`: el objeto del usuario autenticado.
 * - `login`: función para iniciar sesión con un token y un objeto de usuario.
 * - `logout`: función para cerrar sesión.
 * - `isAuthenticated`: booleano que indica si el usuario está autenticado.
 * 
 * @param {{ children: ReactNode }} props
 * @returns {ReactNode} Un proveedor que envuelve al componente `children` con el contexto de autenticación.
 */

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


/**
 * Inicia sesión con un token y un objeto de usuario.
 * 
 * @param {string} tokenValue - El token JWT del usuario autenticado.
 * @param {object} userData - El objeto del usuario autenticado.
 * @returns {void} No devuelve nada.
 * 
 * Esta función establece el estado de autenticación del usuario y
 * guarda el token y el usuario en el almacenamiento local del navegador.
 */
  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData || null);

    // Guardar el token y el usuario en el almacenamiento local
    localStorage.setItem("token", tokenValue);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
  };

  
/**
 * Cierra la sesión del usuario actual.
 * 
 * Establece el estado de autenticación del usuario a `false`, y
 * elimina el token y el usuario del almacenamiento local del
 * navegador.
 * 
 * @returns {void} No devuelve nada.
 */

  const logout = () => {
    setToken(null);
    setUser(null);

    // Eliminar el token y el usuario del almacenamiento local
    localStorage.removeItem("token");
    localStorage.removeItem("user");  
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated:!!token}}>
      {children}
    </AuthContext.Provider>
  );
}
