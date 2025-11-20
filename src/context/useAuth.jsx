import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook para obtener el contexto de autenticación.
 * Devuelve un objeto con las propiedades:
 * - `token`: el token JWT del usuario autenticado.
 * - `user`: el objeto del usuario autenticado.
 * - `login`: función para iniciar sesión con un token y un objeto de usuario.
 * - `logout`: función para cerrar sesión.
 * - `isAuthenticated`: booleano que indica si el usuario está autenticado.
 * 
 * @returns {object} Un objeto con las propiedades mencionadas arriba.
 */
export function useAuth() {
  return useContext(AuthContext);
}

